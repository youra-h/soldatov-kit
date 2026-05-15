import type { TComponentSize, TComponentVariant } from '../../common/types'
import { TComponentView, type IComponentViewOptions } from '../component-view'
import { resolveState } from '../../common/resolve-state'
import type { IStylableProps, TStylableEvents, TStylableStatesOptions } from './types'
import { type IStateUnit, TStateUnit } from '../../common/state-unit'
import { type TValuePayload } from '../../common/types'
import { TEvented } from '../../common/evented'

/**
 * Слой "stylable": унифицированные `size` и `variant`.
 *
 * Раньше эти свойства жили в `TControl`/`TControlInput`.
 * Здесь они вынесены в отдельный слой + state-units.
 */
export default class TStylable<
	TProps extends IStylableProps = IStylableProps,
	TEvents extends TStylableEvents = TStylableEvents,
	TStates extends TStylableStatesOptions = TStylableStatesOptions,
> extends TComponentView<TProps, TEvents, TStates> {
	static defaultValues: Partial<IStylableProps> = {
		...TComponentView.defaultValues,
		size: 'normal',
		variant: 'normal',
	}

	protected _sizeState: IStateUnit<TComponentSize>
	protected _variantState: IStateUnit<TComponentVariant>

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		this._sizeState = resolveState<IStateUnit<TComponentSize>, TComponentSize>({
			state: states?.size,
			ctor: TStateUnit,
			initial: props.size ?? (TStylable.defaultValues.size as TComponentSize),
		})

		this._sizeState.events.on('change', (payload: TValuePayload<TComponentSize>) => {
			;(this.events as TEvented<TStylableEvents>).emit('change:size', payload)
		})

		this._classes.add(`--size-${this._sizeState.value}`)

		this._variantState = resolveState<IStateUnit<TComponentVariant>, TComponentVariant>({
			state: states?.variant,
			ctor: TStateUnit,
			initial: props.variant ?? (TStylable.defaultValues.variant as TComponentVariant),
		})

		this._variantState.events.on('change', (payload: TValuePayload<TComponentVariant>) => {
			;(this.events as TEvented<TStylableEvents>).emit('change:variant', payload)
		})

		this._classes.add(`--${this._variantState.value}`)
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

	getProps(): TProps {
		return {
			...super.getProps(),
			size: this.size,
			variant: this.variant,
		} as TProps
	}
}
