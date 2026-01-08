import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import type { TComponentSize, TComponentVariant } from '../../common/types'
import type { ISpinner, ISpinnerProps, TSpinnerEvents } from './types'
import { TSizeState, TVariantState } from '../../base/states'

export default class TSpinner extends TComponentView<ISpinnerProps, TSpinnerEvents> implements ISpinner {
	static override baseClass = 's-spinner'

	static defaultValues: Partial<ISpinnerProps> = {
		...TComponentView.defaultValues,
		variant: 'primary',
		size: 'normal',
		tag: 'span',
		borderWidth: 'auto',
	}

	readonly sizeState: TSizeState
	readonly variantState: TVariantState
	protected _borderWidth: number | 'auto'

	constructor(options: IComponentViewOptions<ISpinnerProps> | Partial<ISpinnerProps> = {}) {
		super(options)

		const { props = {} } = TComponentView.prepareOptions(options)

		this.sizeState = new TSizeState({
			baseClass: this._baseClass,
			exclude: ['normal'],
			value: (props.size ?? TSpinner.defaultValues.size!) as TComponentSize,
		})
		this.sizeState.events.on('change', (value) => {
			this.events.emit('change:size' as any, value)
		})

		this.variantState = new TVariantState({
			baseClass: this._baseClass,
			exclude: ['normal'],
			value: (props.variant ?? TSpinner.defaultValues.variant!) as TComponentVariant,
		})
		this.variantState.events.on('change', (value) => {
			this.events.emit('change:variant' as any, value)
		})

		this._tag = props.tag ?? TSpinner.defaultValues.tag!
		this._borderWidth = props.borderWidth ?? TSpinner.defaultValues.borderWidth!
	}

	get variant(): TComponentVariant {
		return this.variantState.value as TComponentVariant
	}

	set variant(value: TComponentVariant) {
		this.variantState.value = value as any
	}

	get size(): TComponentSize {
		return this.sizeState.value as TComponentSize
	}

	set size(value: TComponentSize) {
		this.sizeState.value = value as any
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

	get classes(): string[] {
		return [...super.classes, ...this.sizeState.getClass(), ...this.variantState.getClass()]
	}

	/**
	 * Стили для компонента
	 * @return {Record<string, string | number>} Объект со стилями
	 */
	get styles(): Record<string, string | number> {
		const styles: Record<string, string | number> = {}

		// Добавляем толщину бордера
		styles['--spinner-border-width'] = `${this.borderWidth}px`

		return {
			...styles,
		}
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
