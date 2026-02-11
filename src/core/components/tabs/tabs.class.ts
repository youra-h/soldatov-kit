import TControl from '../../base/control/control.class'
import type { IComponentViewOptions } from '../../base/component-view'
import { TComponentView } from '../../base/component-view'
import { TActivatableCollection } from '../../base/collection'
import TTabItem from './tab-item/tab-item.class'
import type { ITabItem } from './tab-item/types'
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

/**
 * Компонент табов (TTabs).
 * Управляет коллекцией табов с поддержкой активности.
 */
export class TTabs
	extends TControl<ITabsProps, TTabsEvents, TTabsStatesOptions>
	implements ITabs
{
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
	protected _orientation: TTabsOrientation
	protected _alignment: TTabsAlignment
	protected _position: TTabsPosition
	protected _appearance: TTabsAppearance
	protected _stretched: boolean
	protected _closable: boolean

	// Композиция: коллекция табов
	protected _collection: TActivatableCollection<any, any, ITabItem>

	constructor(
		options: IComponentViewOptions<ITabsProps, TTabsStatesOptions> | Partial<ITabsProps> = {},
	) {
		super(options)

		const { props = {} } = TComponentView.prepareOptions<ITabsProps, TTabsStatesOptions>(
			options,
		)

		// Инициализация простых свойств
		this._orientation = props.orientation ?? TTabs.defaultValues.orientation!
		this._alignment = props.alignment ?? TTabs.defaultValues.alignment!
		this._position = props.position ?? TTabs.defaultValues.position!
		this._appearance = props.appearance ?? TTabs.defaultValues.appearance!
		this._stretched = props.stretched ?? TTabs.defaultValues.stretched!
		this._closable = props.closable ?? TTabs.defaultValues.closable!

		// Создаем коллекцию табов
		this._collection = new TActivatableCollection<any, any, ITabItem>({
			itemClass: TTabItem as any,
		})

		// Подписка на события коллекции для проксирования
		this._collection.events.on('added', (payload: { collection: any; item: ITabItem }) => {
			const { item } = payload
			this.events.emit('tab:added', item)

			// Подписка на событие закрытия таба — вызывает closeTab с проверкой и удалением
			item.events.on('close', () => {
				this.closeTab(item)
			})
		})

		this._collection.events.on(
			'afterDelete',
			(payload: { collection: any; item: ITabItem; index: number }) => {
				const { item } = payload
				this.events.emit('tab:removed', item)
			},
		)

		this._collection.events.on('change', (payload: { collection: any; item?: ITabItem }) => {
			const { item } = payload
			this.events.emit('tab:activated', item)
		})
	}

	// Простые геттеры/сеттеры без state

	get orientation(): TTabsOrientation {
		return this._orientation
	}

	set orientation(value: TTabsOrientation) {
		if (this._orientation !== value) {
			this._orientation = value
			this.events.emit('change:orientation', value)
		}
	}

	get alignment(): TTabsAlignment {
		return this._alignment
	}

	set alignment(value: TTabsAlignment) {
		if (this._alignment !== value) {
			this._alignment = value
			this.events.emit('change:alignment', value)
		}
	}

	get position(): TTabsPosition {
		return this._position
	}

	set position(value: TTabsPosition) {
		if (this._position !== value) {
			this._position = value
			this.events.emit('change:position', value)
		}
	}

	get appearance(): TTabsAppearance {
		return this._appearance
	}

	set appearance(value: TTabsAppearance) {
		if (this._appearance !== value) {
			this._appearance = value
			this.events.emit('change:appearance', value)
		}
	}

	get stretched(): boolean {
		return this._stretched
	}

	set stretched(value: boolean) {
		if (this._stretched !== value) {
			this._stretched = value
			this.events.emit('change:stretched', value)
		}
	}

	get closable(): boolean {
		return this._closable
	}

	set closable(value: boolean) {
		if (this._closable !== value) {
			this._closable = value
			this.events.emit('change:closable', value)
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
		return item.closable ?? this._closable
	}

	/**
	 * Закрывает таб: проверяет возможность закрытия, эмитит событие и удаляет из коллекции.
	 * Активация следующего таба происходит автоматически в TActivatableCollection.
	 * @returns true если таб был закрыт, false если закрытие запрещено
	 */
	closeTab(item: ITabItem): boolean {
		if (!this.isTabClosable(item)) {
			return false
		}

		this.events.emit('tab:close', item)

		// Удаление элемента - TActivatableCollection автоматически активирует следующий таб
		return this._collection.deleteItem(item)
	}

	override get classes(): string[] {
		const classes = [...super.classes]

		// Добавляем классы для ориентации
		classes.push(`${this._baseClass}--${this._orientation}`)

		// Добавляем классы для выравнивания
		if (this._alignment !== 'start') {
			classes.push(`${this._baseClass}--${this._alignment}`)
		}

		// Добавляем классы для позиции (только для vertical)
		if (this._orientation === 'vertical' && this._position !== 'start') {
			classes.push(`${this._baseClass}--position-${this._position}`)
		}

		// Добавляем классы для внешнего вида
		if (this._appearance !== 'line') {
			classes.push(`${this._baseClass}--${this._appearance}`)
		}

		// Добавляем класс для stretched
		if (this._stretched) {
			classes.push(`${this._baseClass}--stretched`)
		}

		return classes
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


