import type { ICollection } from '@core'
import { TBasePlugin } from '../../base/plugin'
import { TElementPlugin } from '../element'
import { TElementAccumulationPlugin, TInstanceAccumulationPlugin } from '../collection'
import type { IPluginBundle } from '../../base/types'
import type { TDragPluginEvents } from './types'
import { TEvented } from '@core'

/**
 * Плагин drag-and-drop для перетаскивания элементов коллекции.
 *
 * Слушает нативные события `dragstart`, `dragend`, `dragover` на корневом
 * DOM-элементе компонента и при перетаскивании вызывает `collection.move()`,
 * синхронизируя порядок DOM-узлов с порядком элементов в коллекции.
 *
 * Зависит от двух других плагинов, которые должны присутствовать в том же бандле:
 * - {@link TElementPlugin} — предоставляет корневой DOM-элемент компонента.
 * - {@link TElementAccumulationPlugin} — отображает uid элементов коллекции на их DOM-узлы.
 * - {@link TInstanceAccumulationPlugin} — отображает uid элементов коллекции на их instance.
 *
 * @example
 * ```ts
 * const bundle = new TPluginBundle([
 *   new TElementPlugin(),
 *   new TElementAccumulationPlugin(),
 *   new TDragPlugin(),
 * ])
 *
 * const drag = bundle.get(TDragPlugin)!
 * drag.activate(myCollection)
 * // ...
 * drag.deactivate()
 * ```
 *
 * @fires drag:start — при начале перетаскивания, передаёт `{ index, uid }` перетаскиваемого элемента.
 * @fires drag:end   — при завершении перетаскивания (отпускании кнопки мыши).
 */
export class TDragPlugin extends TBasePlugin<TDragPluginEvents> {
	/** Уникальный ключ плагина в бандле. */
	static readonly key = 'drag'

	/** CSS-класс для визуального состояния перетаскиваемого элемента. */
	private static readonly DRAGGING_CLASS = 's-drag-and-drop__item'

	/** Флаг: плагин активирован и ожидает/обрабатывает перетаскивание. */
	private _active = false

	/** Коллекция, порядок элементов которой синхронизируется при перетаскивании. */
	private _collection: ICollection | null = null

	/** Корневой DOM-элемент, на котором висят обработчики drag-событий. */
	private _element: HTMLElement | null = null

	/** Ссылка на плагин, предоставляющий корневой DOM-элемент. */
	private _elementPlugin: TElementPlugin | null = null

	/** Ссылка на плагин, отображающий uid ↔ DOM-узел для каждого элемента коллекции. */
	private _collectionElementsPlugin: TElementAccumulationPlugin | null = null

	/** Ссылка на плагин, отображающий uid ↔ instance для каждого элемента коллекции. */
	private _collectionInstancesPlugin: TInstanceAccumulationPlugin | null = null

	/** Функция очистки: снимает слушателей событий и атрибуты draggable. */
	private _cleanup: (() => void) | null = null

	/**
	 * Инициализация плагина: получает зависимости из бандла и подписывается
	 * на события жизненного цикла DOM-элемента.
	 *
	 * - `ready`   — DOM-элемент смонтирован; если плагин уже активирован, немедленно
	 *               запускает установку обработчиков через `_setup()`.
	 * - `removed` — DOM-элемент демонтирован; снимает все обработчики через `_teardown()`.
	 */
	override install(bundle: IPluginBundle): void {
		this._elementPlugin = bundle.get(TElementPlugin) ?? null
		this._collectionElementsPlugin = bundle.get(TElementAccumulationPlugin) ?? null
		this._collectionInstancesPlugin = bundle.get(TInstanceAccumulationPlugin) ?? null

		this._elementPlugin?.events.on('ready', ({ element }) => {
			this._element = element
			// DOM готов — можно навешивать обработчики, если плагин уже активирован
			if (this._active) this._setup()
		})

		this._elementPlugin?.events.on('removed', () => {
			// DOM демонтирован — снимаем обработчики во избежание утечек памяти
			this._teardown()
			this._element = null
		})
	}

	/**
	 * Активирует перетаскивание для указанной коллекции.
	 *
	 * Если DOM-элемент уже готов, немедленно навешивает обработчики.
	 * Иначе они будут навешены при получении события `ready` от {@link TElementPlugin}.
	 *
	 * @param collection — коллекция, порядок элементов которой будет изменяться при drag-and-drop.
	 */
	activate(collection: ICollection): void {
		this._collection = collection
		this._active = true
		if (this._element) this._setup()
	}

	/**
	 * Деактивирует перетаскивание: снимает все обработчики событий,
	 * убирает атрибуты `draggable` с DOM-узлов и сбрасывает внутреннее состояние.
	 */
	deactivate(): void {
		this._teardown()
		this._active = false
		this._collection = null
	}

	/**
	 * Навешивает нативные drag-обработчики на корневой DOM-элемент и помечает
	 * каждый дочерний DOM-узел коллекции атрибутом `draggable="true"`.
	 *
	 * Вся логика перетаскивания реализована через event delegation: обработчики
	 * висят на корневом элементе, а целевой узел определяется через `closest()`.
	 *
	 * По завершении записывает в `_cleanup` функцию, которая снимает все подписки.
	 */
	private _setup(): void {
		const element = this._element!
		const collection = this._collection!
		const collectionElementsPlugin = this._collectionElementsPlugin!
		const collectionInstancesPlugin = this._collectionInstancesPlugin

		// Индекс перетаскиваемого элемента в коллекции; null — перетаскивание не активно
		let draggingIndex: number | null = null
		let draggingUid: string | number | null = null
		// Последний DOM-узел над которым находился курсор; позволяет пропустить
		// повторные срабатывания dragover когда курсор не покидал элемент
		let lastDragOverTarget: HTMLElement | null = null

		// Помечаем уже существующие DOM-узлы как перетаскиваемые
		collectionElementsPlugin.getAll().forEach((el) => el.setAttribute('draggable', 'true'))

		// Новые узлы, добавленные в коллекцию после активации, тоже должны быть draggable
		const onElementAdded = ({
			element: itemEl,
		}: {
			uid: string | number
			element: HTMLElement
		}) => {
			itemEl.setAttribute('draggable', 'true')
		}

		collectionElementsPlugin.events.on('element:added', onElementAdded)

		/**
		 * Обработчик начала перетаскивания.
		 * Определяет перетаскиваемый узел, запоминает его индекс в коллекции,
		 * включает визуальное состояние перетаскивания через CSS-класс
		 * и генерирует событие `drag:start`.
		 */
		const onDragStart = (e: DragEvent) => {
			const target = (e.target as HTMLElement).closest(
				'[draggable="true"]',
			) as HTMLElement | null

			if (!target || !element.contains(target)) return

			const uid = collectionElementsPlugin.getUidByElement(target)
			if (uid === null) return

			draggingIndex = collection.getItems().findIndex((item) => item.uid === uid)
			if (draggingIndex === -1) {
				draggingIndex = null
				draggingUid = null
				return
			}

			draggingUid = uid
			lastDragOverTarget = null

			e.dataTransfer!.effectAllowed = 'move'
			// Предпочитаем менять classes у instance; это безопаснее для реактивного слоя.
			// DOM-класс оставляем fallback на случай, если instance недоступен.
			const instance = collectionInstancesPlugin?.getByUid(uid)

			if (instance) {
				instance.classes.add(TDragPlugin.DRAGGING_CLASS, false)
			} else {
				target.classList.add(TDragPlugin.DRAGGING_CLASS)
			}
			;(this.events as TEvented<TDragPluginEvents>).emit('drag:start', {
				index: draggingIndex,
				uid: uid as number,
			})
		}

		/**
		 * Обработчик окончания перетаскивания.
		 * Снимает визуальное состояние перетаскивания и сбрасывает внутренние маркеры drag.
		 */
		const onDragEnd = (e: DragEvent) => {
			// Убираем визуальный эффект перетаскивания
			if (draggingUid !== null) {
				const instance = collectionInstancesPlugin?.getByUid(draggingUid)

				if (instance) {
					instance.classes.remove(TDragPlugin.DRAGGING_CLASS, false)
				} else {
					const target = (e.target as HTMLElement).closest(
						'[draggable="true"]',
					) as HTMLElement | null
					if (target) target.classList.remove(TDragPlugin.DRAGGING_CLASS)
				}
			}

			draggingIndex = null
			draggingUid = null
			lastDragOverTarget = null
			;(this.events as TEvented<TDragPluginEvents>).emit('drag:end')
		}

		/**
		 * Обработчик наведения на элемент во время перетаскивания.
		 * При пересечении границы другого элемента коллекции вызывает `collection.move()`,
		 * что немедленно обновляет порядок элементов — реализуя сортировку «в реальном времени».
		 */
		const onDragOver = (e: DragEvent) => {
			// Разрешаем drop (без этого браузер не вызовет drop-событие)
			e.preventDefault()
			e.dataTransfer!.dropEffect = 'move'

			if (draggingIndex === null) return

			const target = (e.target as HTMLElement).closest(
				'[draggable="true"]',
			) as HTMLElement | null

			if (!target || !element.contains(target)) return

			// Курсор остался над тем же узлом (или над его дочерним элементом) — пропускаем
			if (target === lastDragOverTarget) return
			lastDragOverTarget = target

			const targetUid = collectionElementsPlugin.getUidByElement(target)
			if (targetUid === null) return

			const targetIndex = collection.getItems().findIndex((item) => item.uid === targetUid)
			// Пропускаем, если навели на тот же элемент или индекс не найден
			if (targetIndex === -1 || targetIndex === draggingIndex) return

			// Перемещаем элемент в коллекции; фреймворк реактивно обновит DOM
			collection.move(draggingIndex, targetIndex)
			// Обновляем текущий индекс перетаскиваемого элемента
			draggingIndex = targetIndex
			// target остаётся закэшированным — следующие dragover над тем же элементом
			// (включая дочерние кнопки) будут пропущены без лишних пересчётов
		}

		element.addEventListener('dragstart', onDragStart)
		element.addEventListener('dragend', onDragEnd)
		element.addEventListener('dragover', onDragOver)

		// Сохраняем функцию очистки для вызова из _teardown()
		this._cleanup = () => {
			element.removeEventListener('dragstart', onDragStart)
			element.removeEventListener('dragend', onDragEnd)
			element.removeEventListener('dragover', onDragOver)
			collectionElementsPlugin.events.off('element:added', onElementAdded)
			collectionInstancesPlugin?.getAll().forEach((instance) => {
				instance.classes.remove(TDragPlugin.DRAGGING_CLASS, false)
			})
			// Убираем атрибут draggable со всех элементов коллекции
			collectionElementsPlugin.getAll().forEach((el) => {
				el.removeAttribute('draggable')
				el.classList.remove(TDragPlugin.DRAGGING_CLASS)
			})
		}
	}

	/**
	 * Снимает все обработчики событий и сбрасывает функцию очистки.
	 * Безопасно вызывать многократно — повторные вызовы ничего не делают.
	 */
	private _teardown(): void {
		this._cleanup?.()
		this._cleanup = null
	}

	/**
	 * Полное уничтожение плагина: снимает обработчики и вызывает деструктор базового класса.
	 */
	override destroy(): void {
		this._teardown()
		super.destroy()
	}
}
