import type { TComponentSize, TComponentVariant } from '../../../bridge'
import { TComponentView, type IComponentViewOptions } from '../component-view'
import type { IStylableProps, TStylableEvents, TStylableStates } from './types'
import { TStateUnit } from '../../../common'
import type { TValuePayload } from '../../../bridge'
import { TEvented } from '../../../common'

/**
 * Слой "stylable": унифицированные `size` и `variant`.
 *
 * Раньше эти свойства жили в `TControl`/`TControlInput`.
 * Здесь они вынесены в отдельный слой + state-units.
 */
export default class TStylable<
	TProps extends IStylableProps = IStylableProps,
	TEvents extends TStylableEvents = TStylableEvents,
	TStates extends TStylableStates = TStylableStates,
> extends TComponentView<TProps, TEvents, TStates> {
	static defaultValues: Partial<IStylableProps> = {
		...TComponentView.defaultValues,
		size: 'normal',
		variant: 'normal',
	}

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const ctor = new.target as typeof TStylable

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		this._states.size =
			states?.size ??
			new TStateUnit<TComponentSize>({
				initial: props.size ?? (ctor.defaultValues.size as TComponentSize),
			})

		this._states.size.events.on('change', (payload: TValuePayload<TComponentSize>) => {
			this._classes.swapClass({
				oldClass: `--size-${payload.oldValue}`,
				newClass: `--size-${payload.newValue}`,
			})
			;(this.events as TEvented<TStylableEvents>).emit('change:size', payload)
		})

		this._classes.add(`--size-${this._states.size.value}`)

		this._states.variant =
			states?.variant ??
			new TStateUnit<TComponentVariant>({
				initial: props.variant ?? (ctor.defaultValues.variant as TComponentVariant),
			})

		this._states.variant.events.on('change', (payload: TValuePayload<TComponentVariant>) => {
			this._classes.swapClass({
				oldClass: `--${payload.oldValue}`,
				newClass: `--${payload.newValue}`,
			})
			;(this.events as TEvented<TStylableEvents>).emit('change:variant', payload)
		})

		this._classes.add(`--${this._states.variant.value}`)
	}

	get size(): TComponentSize {
		return this._states.size.value
	}

	set size(value: TComponentSize) {
		if (value === this._states.size.value) return

		this._states.size.value = value
	}

	get variant(): TComponentVariant {
		return this._states.variant.value
	}

	set variant(value: TComponentVariant) {
		if (value === this._states.variant.value) return

		this._states.variant.value = value
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			size: this.size,
			variant: this.variant,
		} as TProps
	}
}
