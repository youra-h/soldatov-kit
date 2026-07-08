import { TControl } from '../../base/control'
import type { IComponentViewOptions } from '../../base/component-view'
import { TComponentView } from '../../base/component-view'
import { TActivatableCollection } from '../../base/collection'
import TTabItem from './tab-item/tab-item.class'
import type { ITabItem } from './tab-item/types'
import type { TComponentSize, TComponentVariant, TValuePayload } from '../../../bridge'
import type {
	ITabs,
	ITabsProps,
	TTabsEvents,
	TTabsStates,
	TTabsOrientation,
	TTabsAlignment,
	TTabsPosition,
	TTabsView,
} from './types'
import { TEvented } from '../../../common'

/**
 * Компонент табов (TTabs).
 * Управляет коллекцией табов с поддержкой активности.
 */
export class TTabs extends TControl<ITabsProps, TTabsEvents, TTabsStates> implements ITabs {
	static override baseClass = 's-tabs'

	static defaultValues: Partial<ITabsProps> = {
		...TControl.defaultValues,
		orientation: 'horizontal',
		alignment: 'start',
		position: 'start',
		view: 'line',
		closable: false,
		variant: 'normal',
	}

	// Простые свойства (не state, только для отображения)
	protected _orientation!: TTabsOrientation
	protected _alignment!: TTabsAlignment
	protected _position!: TTabsPosition
	protected _view!: TTabsView
	protected _closable!: boolean

	// Композиция: коллекция табов
	protected _collection: TActivatableCollection<any, any, ITabItem>

	constructor(
		options: IComponentViewOptions<ITabsProps, TTabsStates> | Partial<ITabsProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TTabs

		const { props = {} } = TComponentView.prepareOptions<ITabsProps, TTabsStates>(options)

		// Создаем коллекцию табов
		this._collection = new TActivatableCollection<any, any, ITabItem>({
			itemClass: TTabItem,
		})

		if (props.items) {
			this._collection.setItems(props.items)
		}

		// Инициализация простых свойств
		this._applyOrientation(props.orientation ?? ctor.defaultValues.orientation!)
		this._applyAlignment(props.alignment ?? ctor.defaultValues.alignment!)
		this._applyPosition(props.position ?? ctor.defaultValues.position!)
		this._applyView(props.view ?? ctor.defaultValues.view!)
		this._applyClosable(props.closable ?? ctor.defaultValues.closable!)

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

		// Условие для поиска следующего активного таба при удалении
		this._collection.events.on(
			'resolve:_activatablePredicate',
			() => (tab: ITabItem) => !tab.disabled && tab.present,
		)

		this.events.relay(this._collection.events, [
			{
				from: 'item:added',
				then: (payload: any) => {
					const { item } = payload as { collection: any; item: ITabItem }

					item.events.on('close', () => this.closeTab(item))
					item.setClosableResolver(() => this._closable)

					item.events.on('change:closable', (value: boolean | undefined) => {
						; (this.events as TEvented<TTabsEvents>).emit('item:closable', item, !!value)
					})

					item.events.on('change:disabled', (value: boolean) => {
						; (this.events as TEvented<TTabsEvents>).emit('item:disabled', item, value)
					})

					item.events.on('change:text', (payload: TValuePayload<string>) => {
						; (this.events as TEvented<TTabsEvents>).emit(
							'item:text',
							item,
							payload.newValue,
						)
					})

					item.events.on('change:rendered', (value: boolean) => {
						; (this.events as TEvented<TTabsEvents>).emit('item:rendered', item, value)
					})

					item.events.on('change:visible', (value: boolean) => {
						; (this.events as TEvented<TTabsEvents>).emit('item:visible', item, value)
					})

					item.events.on('change:present', (value: boolean) => {
						; (this.events as TEvented<TTabsEvents>).emit('item:present', item, value)
					})

					item.disabled = this.disabled
					item.size = this.size
					item.variant = this.variant
				},
			},
			'item:activated',
			'item:deactivated',
			'item:beforeDelete',
			'item:deleted',
			'item:afterDelete',
			'item:beforeMove',
			'item:moved',
			'item:afterMove',
		])

		this.events.on('change:disabled', (value) => {
			// При изменении disabled у контейнера — обновляем доступность всех табов
			this._collection.items.forEach((item) => {
				item.disabled = value
			})
		})
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
				; (this.events as TEvented<TTabsEvents>).emit('change:orientation', value)
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
				; (this.events as TEvented<TTabsEvents>).emit('change:alignment', value)
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
				; (this.events as TEvented<TTabsEvents>).emit('change:position', value)
		}
	}

	get view(): TTabsView {
		return this._view
	}

	protected _applyView(newValue: TTabsView, oldValue?: TTabsView) {
		this._classes.swapClass({
			oldClass: `--${oldValue}`,
			newClass: `--${newValue}`,
		})

		this._view = newValue
	}

	set view(value: TTabsView) {
		if (this._view !== value) {
			this._applyView(value, this._view)
				; (this.events as TEvented<TTabsEvents>).emit('change:view', value)
		}
	}

	get closable(): boolean {
		return this._closable
	}

	protected _applyClosable(value: boolean) {
		this._closable = value

		this.collection.items.forEach((item) => {
			if (item instanceof TTabItem) {
				item.notifyClosableChange(this._closable || item.closable)
			}
		})
	}

	set closable(value: boolean) {
		if (this._closable !== value) {
			this._applyClosable(value)
				; (this.events as TEvented<TTabsEvents>).emit('change:closable', value)
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
	 * Закрывает таб: проверяет возможность закрытия, эмитит событие и удаляет из коллекции.
	 * Если закрывается активный таб, заранее активируем ближайший подходящий (enabled + visible + rendered).
	 * @returns true если таб был закрыт, false если закрытие запрещено
	 */
	closeTab(item: ITabItem): boolean {
		if (!item.closable) return false
			; (this.events as TEvented<TTabsEvents>).emit('item:close', item)

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
			view: this._view,
			closable: this._closable,
		}
	}
}
