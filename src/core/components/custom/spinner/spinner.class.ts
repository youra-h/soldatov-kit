import { TStylable } from '../../base/stylable'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import { type TEvented } from '../../../common'
import type { ISpinner, ISpinnerProps, TSpinnerEvents, TSpinnerStates } from './types'

export default class TSpinner extends TStylable<ISpinnerProps, TSpinnerEvents> implements ISpinner {
	static override baseClass = 's-spinner'

	static defaultValues: Partial<ISpinnerProps> = {
		...TStylable.defaultValues,
		variant: 'accent',
		tag: 'span',
		borderWidth: 'auto',
	}

	protected _borderWidth: number | 'auto'

	constructor(
		options: IComponentViewOptions<ISpinnerProps, TSpinnerStates> | Partial<ISpinnerProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TSpinner

		const { props = {} as Partial<ISpinnerProps> } = TComponentView.prepareOptions<
			ISpinnerProps,
			TSpinnerStates
		>(options)

		this._borderWidth = props.borderWidth ?? ctor.defaultValues.borderWidth!
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
			borderWidth: this._borderWidth,
		} as ISpinnerProps
	}
}
