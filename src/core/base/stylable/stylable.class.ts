import type { TComponentSize, TComponentVariant } from '../../common/types'
import TPresentable from '../presentable/presentable.class'
import { TSizeState } from '../states/size.state'
import { TVariantState } from '../states/variant.state'
import type { IStylableProps, TStylableEvents } from './types'

/**
 * Слой "stylable": унифицированные `size` и `variant`.
 *
 * Раньше эти свойства жили в `TControl`/`TControlInput`.
 * Здесь они вынесены в отдельный слой + state-units.
 */
export default class TStylable<
	TProps extends IStylableProps = IStylableProps,
	TEvents extends TStylableEvents = TStylableEvents,
> extends TPresentable<TProps, TEvents> {
	static defaultValues: Partial<IStylableProps> = {
		...TPresentable.defaultValues,
		size: 'normal',
		variant: 'normal',
	}

	protected _sizeState: TSizeState
	protected _variantState: TVariantState

	constructor(options: any = {}) {
		super(options)

		const { props = {} } = options

		this._sizeState = new TSizeState({
			baseClass: this._baseClass,
			value: (props.size ?? TStylable.defaultValues.size) as TComponentSize,
		})
		this._sizeState.events.on('change', (value) => {
			this.events.emit('change:size' as any, value)
		})

		this._variantState = new TVariantState({
			baseClass: this._baseClass,
			value: (props.variant ?? TStylable.defaultValues.variant) as TComponentVariant,
		})
		this._variantState.events.on('change', (value) => {
			this.events.emit('change:variant' as any, value)
		})
	}

	get size(): TComponentSize {
		return this._sizeState.value
	}

	set size(value: TComponentSize) {
		this._sizeState.value = value
	}

	get variant(): TComponentVariant {
		return this._variantState.value
	}

	set variant(value: TComponentVariant) {
		this._variantState.value = value
	}

	get classes(): string[] {
		return [...super.classes, ...this._variantState.getClass(), ...this._sizeState.getClass()]
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			size: this.size,
			variant: this.variant,
		} as TProps
	}
}
