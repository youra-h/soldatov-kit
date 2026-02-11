import TValueControl from '../../../base/value-control/value-control.class'
import type { IComponentViewOptions } from '../../../base/component-view'
import { TComponentView } from '../../../base/component-view'
import { resolveState } from '../../../common/resolve-state'
import { TStateUnit, type IStateUnit } from '../../../base/state-unit'
import type {
	ITabItemCustom,
	ITabItemCustomProps,
	TTabItemCustomEvents,
	TTabItemCustomStatesOptions,
} from './types'

/**
 * Кастомная логика элемента таба (без коллекционной части).
 * Наследуется от TValueControl, где value — это ключ таба.
 * Generic TProps позволяет передавать расширенные Props (например, ITabItemProps с active).
 */
export default class TTabItemCustom<
	TProps extends ITabItemCustomProps = ITabItemCustomProps,
	TEvents extends TTabItemCustomEvents = TTabItemCustomEvents,
>
	extends TValueControl<string | number, TProps, TEvents, TTabItemCustomStatesOptions>
	implements ITabItemCustom<TProps>
{
	static override baseClass = 's-tab-item'

	static defaultValues: Partial<ITabItemCustomProps> = {
		...TValueControl.defaultValues,
		text: '',
		value: '',
		closable: undefined,
		variant: 'normal',
	}

	protected _textState: IStateUnit<string>
	protected _closableState: IStateUnit<boolean | undefined>

	constructor(
		options: IComponentViewOptions<TProps, TTabItemCustomStatesOptions> | Partial<TProps> = {},
	) {
		super(options)

		const { props = {}, states } = TComponentView.prepareOptions<
			TProps,
			TTabItemCustomStatesOptions
		>(options)

		// Type assertion: TProps extends ITabItemCustomProps, поэтому props содержит text и closable
		const customProps = props as Partial<ITabItemCustomProps>

		// Инициализация state-объектов
		this._textState = resolveState<IStateUnit<string>, string>(
			states?.text,
			TStateUnit,
			customProps.text ?? TTabItemCustom.defaultValues.text!,
		)

		this._closableState = resolveState<IStateUnit<boolean | undefined>, boolean | undefined>(
			states?.closable,
			TStateUnit,
			customProps.closable ?? TTabItemCustom.defaultValues.closable,
		)

		// Подписка на изменения state-объектов
		this._textState.events.on('change', (value) => {
			this.events.emit('change:text', value)
		})

		this._closableState.events.on('change', (value) => {
			this.events.emit('change:closable', value)
		})
	}

	get text(): string {
		return this._textState.value
	}

	set text(value: string) {
		this._textState.value = value
	}

	get closable(): boolean | undefined {
		return this._closableState.value
	}

	set closable(value: boolean | undefined) {
		this._closableState.value = value
	}

	close(): void {
		this.events.emit('close')
	}

	override get classes(): string[] {
		const classes = [...super.classes]

		if (this.closable) {
			classes.push(`${this._baseClass}--closable`)
		}

		return classes
	}

	override getProps(): TProps {
		return {
			...super.getProps(),
			text: this.text,
			closable: this.closable,
		} as TProps
	}
}
