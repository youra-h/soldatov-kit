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
 * Наследуется от TValueControl, где value - это ключ таба.
 */
export default class TTabItemCustom
	extends TValueControl<string | number, ITabItemCustomProps, TTabItemCustomEvents, TTabItemCustomStatesOptions>
	implements ITabItemCustom
{
	static override baseClass = 's-tab-item'

	static defaultValues: Partial<ITabItemCustomProps> = {
		...TValueControl.defaultValues,
		text: '',
		value: '',
		badge: undefined,
		closable: false,
		variant: 'normal',
	}

	protected _textState: IStateUnit<string>
	protected _badgeState: IStateUnit<string | number | undefined>
	protected _closableState: IStateUnit<boolean>

	constructor(
		options:
			| IComponentViewOptions<ITabItemCustomProps, TTabItemCustomStatesOptions>
			| Partial<ITabItemCustomProps> = {},
	) {
		super(options)

		const { props = {}, states } = TComponentView.prepareOptions<
			ITabItemCustomProps,
			TTabItemCustomStatesOptions
		>(options)

		// Инициализация state-объектов
		this._textState = resolveState<IStateUnit<string>, string>(
			states?.text,
			TStateUnit,
			props.text ?? TTabItemCustom.defaultValues.text!,
		)

		this._badgeState = resolveState<
			IStateUnit<string | number | undefined>,
			string | number | undefined
		>(states?.badge, TStateUnit, props.badge ?? TTabItemCustom.defaultValues.badge)

		this._closableState = resolveState<IStateUnit<boolean>, boolean>(
			states?.closable,
			TStateUnit,
			props.closable ?? TTabItemCustom.defaultValues.closable!,
		)

		// Подписка на изменения state-объектов
		this._textState.events.on('change', (value) => {
			this.events.emit('change:text', value)
		})

		this._badgeState.events.on('change', (value) => {
			this.events.emit('change:badge', value)
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

	get badge(): string | number | undefined {
		return this._badgeState.value
	}

	set badge(value: string | number | undefined) {
		this._badgeState.value = value
	}

	get closable(): boolean {
		return this._closableState.value
	}

	set closable(value: boolean) {
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

		if (this.badge !== undefined) {
			classes.push(`${this._baseClass}--with-badge`)
		}

		return classes
	}

	override getProps(): ITabItemCustomProps {
		return {
			...super.getProps(),
			text: this.text,
			badge: this.badge,
			closable: this.closable,
		}
	}
}
