import type { TComponentSize, TComponentVariant } from '../../common/types'
import { TPresentable, type IPresentableOptions } from '../presentable'
import { TSizeState, TVariantState } from '../states'
import type { IModifierValueState, TSizeStateOptions, TVariantStateOptions } from '../states'
import type { IStylableProps, TStylableEvents, TStylableStatesOptions } from './types'

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
> extends TPresentable<TProps, TEvents, TStates> {
	static defaultValues: Partial<IStylableProps> = {
		...TPresentable.defaultValues,
		size: 'normal',
		variant: 'normal',
	}

	protected _sizeState: IModifierValueState<TComponentSize>
	protected _variantState: IModifierValueState<TComponentVariant>

	constructor(options: IPresentableOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TPresentable.prepareOptions<
			TProps,
			TStates
		>(options)

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

		this._sizeState = new SizeCtor(sizeOptions)
		this._sizeState.events.on('change', (value) => {
			this.events.emit('change:size' as any, value)
		})

		this._variantState = new VariantCtor(variantOptions)
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
