import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import type { TComponentSize, TComponentVariant } from '../../common/types'
import type { ISpinner, ISpinnerProps, TSpinnerEvents, TSpinnerStatesOptions } from './types'
import { resolveState } from '../../common/resolve-state'
import { type IStateUnit, TStateUnit } from '../../common/state-unit'
import type { TValuePayload } from '../../common/types'
import { TEvented } from '../../common/evented'

export default class TSpinner
	extends TComponentView<ISpinnerProps, TSpinnerEvents, TSpinnerStatesOptions>
	implements ISpinner
{
	static override baseClass = 's-spinner'

	static defaultValues: Partial<ISpinnerProps> = {
		...TComponentView.defaultValues,
		variant: 'accent',
		size: 'normal',
		tag: 'span',
		borderWidth: 'auto',
	}

	protected _sizeState: IStateUnit<TComponentSize>
	protected _variantState: IStateUnit<TComponentVariant>
	protected _borderWidth: number | 'auto'

	constructor(
		options:
			| IComponentViewOptions<ISpinnerProps, TSpinnerStatesOptions>
			| Partial<ISpinnerProps> = {},
	) {
		super(options)

		const { props = {} as Partial<ISpinnerProps>, states } = TComponentView.prepareOptions<
			ISpinnerProps,
			TSpinnerStatesOptions
		>(options)

		this._sizeState = resolveState<IStateUnit<TComponentSize>, TComponentSize>({
			state: states?.size,
			ctor: TStateUnit,
			initial: (props.size ?? TSpinner.defaultValues.size!) as TComponentSize,
		})

		this._sizeState.events.on('change', (payload: TValuePayload<TComponentSize>) => {
			;(this.events as TEvented<TSpinnerEvents>).emit('change:size', payload)
		})

		this._classes.add(`--size-${this._sizeState.value}`)

		this._variantState = resolveState<IStateUnit<TComponentVariant>, TComponentVariant>({
			state: states?.variant,
			ctor: TStateUnit,
			initial: (props.variant ?? TSpinner.defaultValues.variant!) as TComponentVariant,
		})

		this._variantState.events.on('change', (payload: TValuePayload<TComponentVariant>) => {
			;(this.events as TEvented<TSpinnerEvents>).emit('change:variant', payload)
		})

		this._classes.add(`--${this._variantState.value}`)

		this._tag = props.tag ?? TSpinner.defaultValues.tag!
		this._borderWidth = props.borderWidth ?? TSpinner.defaultValues.borderWidth!
	}

	get variant(): TComponentVariant {
		return this._variantState.value
	}

	protected _applyVariant(newValue: TComponentVariant, oldValue?: TComponentVariant) {
		this._classes.swapClass({
			oldClass: `--${oldValue}`,
			newClass: `--${newValue}`,
		})

		this._variantState.value = newValue
	}

	set variant(value: TComponentVariant) {
		if (value === this._variantState.value) return

		this._applyVariant(value, this._variantState.value)
	}

	get size(): TComponentSize {
		return this._sizeState.value
	}

	protected _applySize(newValue: TComponentSize, oldValue?: TComponentSize) {
		this._classes.swapClass({
			oldClass: `--size-${oldValue}`,
			newClass: `--size-${newValue}`,
		})

		this._sizeState.value = newValue
	}

	set size(value: TComponentSize) {
		if (value === this._sizeState.value) return

		this._applySize(value, this._sizeState.value)
	}

	get borderWidth(): number | 'auto' {
		if (this._borderWidth === 'auto') {
			return this.calculateBorderWidth()
		}

		return this._borderWidth
	}

	set borderWidth(value: number | 'auto') {
		if (this._borderWidth !== value) {
			this._borderWidth = value
			;(this.events as TEvented<TSpinnerEvents>).emit('change:borderWidth', value)
		}
	}

	/**
	 * Автоматически рассчитывает ширину бордера в зависимости от размера спиннера
	 * @return {number} Ширина бордера в пикселях
	 */
	calculateBorderWidth(): number {
		if (this.size === 'xl') return 2
		if (this.size === '2xl') return 2

		return 1
	}

	getProps(): ISpinnerProps {
		return {
			...super.getProps(),
			size: this.size,
			variant: this.variant,
			borderWidth: this._borderWidth,
		}
	}
}
