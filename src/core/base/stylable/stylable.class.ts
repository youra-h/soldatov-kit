import type { TComponentSize, TComponentVariant } from '../../common/types'
import { TPresentable } from '../presentable'
import { TSizeState, TVariantState } from '../states'
import type { IModifierValueState, TSizeStateOptions, TVariantStateOptions } from '../states'
import type { IStylableOptions, IStylableProps, TStylableEvents } from './types'

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

	protected _sizeState: IModifierValueState<TComponentSize>
	protected _variantState: IModifierValueState<TComponentVariant>

	constructor(options: IStylableOptions<TProps> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TPresentable.prepareOptions<TProps>(
			options as any,
		) as unknown as { props: Partial<TProps>; states?: IStylableOptions<TProps>['states'] }

		const sizeOptions: TSizeStateOptions = {
			baseClass: this._baseClass,
			value: (props.size ?? TStylable.defaultValues.size) as TComponentSize,
		}
		const variantOptions: TVariantStateOptions = {
			baseClass: this._baseClass,
			value: (props.variant ?? TStylable.defaultValues.variant) as TComponentVariant,
		}

		const SizeCtor = states?.size ?? TSizeState
		const VariantCtor = states?.variant ?? TVariantState

		this._sizeState = states?.createSize ? states.createSize(sizeOptions) : new SizeCtor(sizeOptions)
		this._sizeState.events.on('change', (value) => {
			this.events.emit('change:size' as any, value)
		})

		this._variantState = states?.createVariant
			? states.createVariant(variantOptions)
			: new VariantCtor(variantOptions)
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
