import type { TComponentSize, TComponentVariant } from '../../common/types'
import { TComponentView, type IComponentViewOptions } from '../component-view'
import { resolveState } from '../../common/resolve-state'
import type { IStylableProps, TStylableEvents, TStylableStatesOptions } from './types'
import { type IStateUnit, TStateUnit } from '../../common/state-unit'
import { type TValuePayload } from '../../common/types'

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
			this.events.emit('change:size', payload)

			this._classes.swapClass({
				oldClass: `--size-${payload.oldValue}`,
				newClass: `--size-${payload.newValue}`,
			})
		})

		this._variantState = resolveState<IStateUnit<TComponentVariant>, TComponentVariant>({
			state: states?.variant,
			ctor: TStateUnit,
			initial: props.variant ?? (TStylable.defaultValues.variant as TComponentVariant),
		})

		this._variantState.events.on('change', (payload: TValuePayload<TComponentVariant>) => {
			this.events.emit('change:variant', payload)

			this._classes.swapClass({
				oldClass: `--variant-${payload.oldValue}`,
				newClass: `--variant-${payload.newValue}`,
			})
		})
	}

	get size(): TComponentSize {
		return this._sizeState.value
	}

	set size(value: TComponentSize) {
		if (value === this._sizeState.value) return

		this._sizeState.value = value
	}

	get variant(): TComponentVariant {
		return this._variantState.value
	}

	set variant(value: TComponentVariant) {
		if (value === this._variantState.value) return

		this._variantState.value = value
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			size: this.size,
			variant: this.variant,
		} as TProps
	}
}
