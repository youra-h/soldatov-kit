import TControl from '../../base/control/control.class'
import type { IComponentViewOptions } from '../../base/component-view'
import { TComponentView } from '../../base/component-view'
import { TActivatableCollection } from '../../base/collection'
import TTabItem from './tab-item/tab-item.class'
import type { ITabItem } from './tab-item/types'
import type { TComponentSize, TComponentVariant } from '../../common/types'
import { type TValuePayload } from '../../common/types'
import type {
	ITabs,
	ITabsProps,
	TTabsEvents,
	TTabsStatesOptions,
	TTabsOrientation,
	TTabsAlignment,
	TTabsPosition,
	TTabsAppearance,
} from './types'
import { TEvented } from '../../common/evented'

/**
 * Компонент табов (TTabs).
 * Управляет коллекцией табов с поддержкой активности.
 */
export class TTabs extends TControl<ITabsProps, TTabsEvents, TTabsStatesOptions> implements ITabs {
	static override baseClass = 's-tabs'

	static defaultValues: Partial<ITabsProps> = {
		...TControl.defaultValues,
		orientation: 'horizontal',
		alignment: 'start',
		position: 'start',
		appearance: 'line',
		stretched: false,
		closable: false,
		variant: 'normal',
	}

	// Простые свойства (не state, только для отображения)
	protected _orientation!: TTabsOrientation
	protected _alignment!: TTabsAlignment
	protected _position!: TTabsPosition
	protected _appearance!: TTabsAppearance
	protected _stretched!: boolean
	protected _closable!: boolean

	// Композиция: коллекция табов
	protected _collection: TActivatableCollection<any, any, ITabItem>

	constructor(
		options: IComponentViewOptions<ITabsProps, TTabsStatesOptions> | Partial<ITabsProps> = {},
	) {
		super(options)

		const { props = {} } = TComponentView.prepareOptions<ITabsProps, TTabsStatesOptions>(
			options,
		)

		// Создаем коллекцию табов
		this._collection = new TActivatableCollection<any, any, ITabItem>({
			itemClass: TTabItem,
		})

		// Инициализация простых свойств
		this._applyOrientation(props.orientation ?? TTabs.defaultValues.orientation!)
		this._applyAlignment(props.alignment ?? TTabs.defaultValues.alignment!)
		this._applyPosition(props.position ?? TTabs.defaultValues.position!)
		this._applyAppearance(props.appearance ?? TTabs.defaultValues.appearance!)
		this._applyStretched(props.stretched ?? TTabs.defaultValues.stretched!)
		this._applyClosable(props.closable ?? TTabs.defaultValues.closable!)

		// Условие для поиска следующего активного таба при удалении
		this._collection.events.on(
			'resolve:_activatablePredicate',
			() => (tab: ITabItem) => !tab.disabled && tab.visible && tab.rendered,
		)

		// Подписка на события коллекции для проксирования
		this._collection.events.on('item:added', (payload: { collection: any; item: ITabItem }) => {
			const { item } = payload

			// Подписка на событие закрытия таба — вызывает closeTab с проверкой и удалением
			item.events.on('close', () => {
				this.closeTab(item)
			})

			// Инжектируем резолвер для closable: таб узнает о дефолте родительского контейнера
			item.setClosableParent(() => this._closable)

			// Проброс change:closable → tab:closable
			item.events.on('change:closable', (value: boolean | undefined) => {
				;(this.events as TEvented<TTabsEvents>).emit('tab:closable', item, !!value)
			})

			// Проброс change:disabled → tab:disabled
			item.events.on('change:disabled', (value: boolean) => {
				;(this.events as TEvented<TTabsEvents>).emit('tab:disabled', item, value)
			})

			// Проброс change:text → tab:text
			item.events.on('change:text', (payload: TValuePayload<string>) => {
				;(this.events as TEvented<TTabsEvents>).emit('tab:text', item, payload.newValue)
			})

			// Propagation: новый таб наследует size и variant от контейнера
			item.size = this.size
			item.variant = this.variant

			// Пробрасываем событие наружу
			;(this.events as TEvented<TTabsEvents>).emit('item:added', payload)
		})

		// Propagation: при изменении size/variant у контейнера — обновляем все существующие итемы
		this.events.on('change:size', (payload: TValuePayload<TComponentSize>) => {
			this._collection.forEach((item) => {
				item.size = payload.newValue
			})
		})

		this.events.on('change:variant', (payload: TValuePayload<TComponentVariant>) => {
			this._collection.forEach((item) => {
				item.variant = payload.newValue
			})
		})

		this._collection.events.on(
			'item:deleted',
			(payload: { collection: any; item: ITabItem }) => {
				// Пробрасываем событие наружу
				;(this.events as TEvented<TTabsEvents>).emit('item:deleted', payload)
			},
		)

		this._collection.events.on(
			'item:activated',
			(payload: { collection: any; item: ITabItem }) => {
				// Пробрасываем событие наружу
				;(this.events as TEvented<TTabsEvents>).emit('item:activated', payload)
			},
		)

		this._collection.events.on('item:deactivated', (payload: { collection: any }) => {
			// Пробрасываем событие наружу
			;(this.events as TEvented<TTabsEvents>).emit('item:deactivated', payload)
		})

		this._collection.events.on(
			'item:moved',
			(payload: { collection: any; item: ITabItem; oldIndex: number; newIndex: number }) => {
				// Пробрасываем событие наружу
				;(this.events as TEvented<TTabsEvents>).emit('item:moved', payload)
			},
		)
	}

	// Простые геттеры/сеттеры без state
	get orientation(): TTabsOrientation {
		return this._orientation
	}

	protected _applyOrientation(newValue: TTabsOrientation, oldValue?: TTabsOrientation) {
		this._classes.swapClass({
			oldClass: `--${oldValue}`,
			newClass: `--${newValue}`,
		})

		this._orientation = newValue
	}

	set orientation(value: TTabsOrientation) {
		if (this._orientation !== value) {
			this._applyOrientation(value, this._orientation)
			;(this.events as TEvented<TTabsEvents>).emit('change:orientation', value)
		}
	}

	get alignment(): TTabsAlignment {
		return this._alignment
	}

	protected _applyAlignment(newValue: TTabsAlignment, oldValue?: TTabsAlignment) {
		this._classes.swapClass({
			oldClass: `--${oldValue}`,
			newClass: newValue !== 'start' ? `--${newValue}` : '',
		})

		this._alignment = newValue
	}

	set alignment(value: TTabsAlignment) {
		if (this._alignment !== value) {
			this._applyAlignment(value, this._alignment)
			;(this.events as TEvented<TTabsEvents>).emit('change:alignment', value)
		}
	}

	get position(): TTabsPosition {
		return this._position
	}

	protected _applyPosition(newValue: TTabsPosition, oldValue?: TTabsPosition) {
		this._classes.remove(`--position-${oldValue}`)

		if (this._orientation === 'vertical' && newValue !== 'start') {
			this._classes.add(`--position-${newValue}`)
		}

		this._position = newValue
	}

	set position(value: TTabsPosition) {
		if (this._position !== value) {
			this._applyPosition(value, this._position)
			;(this.events as TEvented<TTabsEvents>).emit('change:position', value)
		}
	}

	get appearance(): TTabsAppearance {
		return this._appearance
	}

	protected _applyAppearance(newValue: TTabsAppearance, oldValue?: TTabsAppearance) {
		this._classes.swapClass({
			oldClass: `--${oldValue}`,
			newClass: `--${newValue}`,
		})

		this._appearance = newValue
	}

	set appearance(value: TTabsAppearance) {
		if (this._appearance !== value) {
			this._applyAppearance(value, this._appearance)
			;(this.events as TEvented<TTabsEvents>).emit('change:appearance', value)
		}
	}

	get stretched(): boolean {
		return this._stretched
	}

	protected _applyStretched(value: boolean) {
		this._classes.toggle(`--stretched`, value)

		this._stretched = value
	}

	set stretched(value: boolean) {
		if (this._stretched !== value) {
			this._applyStretched(value)
			;(this.events as TEvented<TTabsEvents>).emit('change:stretched', value)
		}
	}

	get closable(): boolean {
		return this._closable
	}

	protected _applyClosable(value: boolean) {
		this._closable = value
	}

	set closable(value: boolean) {
		if (this._closable !== value) {
			this._applyClosable(value)
			;(this.events as TEvented<TTabsEvents>).emit('change:closable', value)
		}
	}

	// Проксирование на коллекцию

	get activeItem(): ITabItem | undefined {
		return this._collection.activeItem
	}

	get count(): number {
		return this._collection.count
	}

	get collection(): TActivatableCollection<any, any, ITabItem> {
		return this._collection
	}

	/**
	 * Проверяет, может ли конкретный таб быть закрыт.
	 * Логика: item.closable ?? this.closable
	 * - Если у таба явно задан closable (true/false) — используется значение таба.
	 * - Если у таба closable = undefined — наследуется от родителя (TTabs.closable).
	 */
	isTabClosable(item: ITabItem): boolean {
		return item.isClosable
	}

	/**
	 * Закрывает таб: проверяет возможность закрытия, эмитит событие и удаляет из коллекции.
	 * Если закрывается активный таб, заранее активируем ближайший подходящий (enabled + visible + rendered).
	 * @returns true если таб был закрыт, false если закрытие запрещено
	 */
	closeTab(item: ITabItem): boolean {
		if (!this.isTabClosable(item)) {
			return false
		}

		;(this.events as TEvented<TTabsEvents>).emit('tab:close', item)

		return this._collection.deleteItem(item)
	}

	/**
	 * Возвращает true, если в коллекции есть хотя бы один таб с disabled = false и visible = true и rendered = true (т.е. который может быть активирован и отображается), иначе false.
	 * Используется для проверки наличия активных табов при удалении текущего активного таба, чтобы понять, нужно ли искать новый активный таб или оставлять неактивным.
	 * Также может использоваться в UI для отображения состояния "нет доступных табов" или отключения кнопки "закрыть" при единственном оставшемся неактивном табе.
	 * @returns boolean
	 */
	hasEnabledTabs(): boolean {
		return this._collection.items.some(
			(item) => !item.disabled && item.visible && item.rendered,
		)
	}

	override getProps(): ITabsProps {
		return {
			...super.getProps(),
			orientation: this._orientation,
			alignment: this._alignment,
			position: this._position,
			appearance: this._appearance,
			stretched: this._stretched,
			closable: this._closable,
		}
	}
}
