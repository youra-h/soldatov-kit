import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import type { TComponentSize, TComponentVariant } from '../../common/types'
import type { ISpinner, ISpinnerProps, TSpinnerEvents, TSpinnerStatesOptions } from './types'
import { TStateUnit } from '../../common/state-unit'
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

	protected _borderWidth: number | 'auto'

	constructor(
		options:
			| IComponentViewOptions<ISpinnerProps, TSpinnerStatesOptions>
			| Partial<ISpinnerProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TSpinner

		const { props = {} as Partial<ISpinnerProps>, states } = TComponentView.prepareOptions<
			ISpinnerProps,
			TSpinnerStatesOptions
		>(options)

		this._states.size =
			states?.size ??
			new TStateUnit<TComponentSize>({
				initial: (props.size ?? ctor.defaultValues.size!) as TComponentSize,
			})

		this._states.size.events.on('change', (payload: TValuePayload<TComponentSize>) => {
			this._classes.swapClass({
				oldClass: `--size-${payload.oldValue}`,
				newClass: `--size-${payload.newValue}`,
			})
			;(this.events as TEvented<TSpinnerEvents>).emit('change:size', payload)
		})

		this._classes.add(`--size-${this._states.size.value}`)

		this._states.variant =
			states?.variant ??
			new TStateUnit<TComponentVariant>({
				initial: (props.variant ?? ctor.defaultValues.variant!) as TComponentVariant,
			})

		this._states.variant.events.on('change', (payload: TValuePayload<TComponentVariant>) => {
			this._classes.swapClass({
				oldClass: `--${payload.oldValue}`,
				newClass: `--${payload.newValue}`,
			})
			;(this.events as TEvented<TSpinnerEvents>).emit('change:variant', payload)
		})

		this._classes.add(`--${this._states.variant.value}`)

		this._borderWidth = props.borderWidth ?? ctor.defaultValues.borderWidth!
	}

	get variant(): TComponentVariant {
		return this._states.variant.value
	}

	set variant(value: TComponentVariant) {
		if (value === this._states.variant.value) return

		this._states.variant.value = value
	}

	get size(): TComponentSize {
		return this._states.size.value
	}

	set size(value: TComponentSize) {
		if (value === this._states.size.value) return

		this._states.size.value = value
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
