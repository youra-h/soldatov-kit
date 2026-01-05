import { TComponent, type IComponentOptions } from '../../base/component'
import type { TComponentSize, TComponentVariant } from '../../common/types'
import type { ISpinner, ISpinnerProps, TSpinnerEvents } from './types'
import { TSize } from '@/core/common/size'
import { TVariant } from '../../common/variant'

export default class TSpinner extends TComponent<ISpinnerProps, TSpinnerEvents> implements ISpinner {
	static defaultValues: Partial<ISpinnerProps> = {
		...TComponent.defaultValues,
		variant: 'primary',
		size: 'normal',
		tag: 'span',
		borderWidth: 'auto',
	}

	protected _sizeHelper: TSize
	protected _variantHelper: TVariant
	protected _borderWidth: number | 'auto'

	constructor(options: IComponentOptions<ISpinnerProps> = {}) {
		options = TComponent.prepareOptions(options, 's-spinner')

		super(options)

		const { props = {} } = options

		this._sizeHelper = new TSize({
			baseClass: this._baseClass,
			exclude: ['normal'],
			value: TSpinner.defaultValues.size!,
		})

		this._variantHelper = new TVariant({
			baseClass: this._baseClass,
			exclude: ['normal'],
			value: props.variant ?? TSpinner.defaultValues.variant!,
		})

		this._tag = props.tag ?? TSpinner.defaultValues.tag!
		this._borderWidth = props.borderWidth ?? TSpinner.defaultValues.borderWidth!
		this.size = props.size ?? TSpinner.defaultValues.size!
	}

	get variant(): TComponentVariant {
		return this._variantHelper.value
	}

	set variant(value: TComponentVariant) {
		if (this._variantHelper.value !== value) {
			this._variantHelper.value = value
		}
	}

	get size(): TComponentSize {
		return this._sizeHelper.value
	}

	set size(value: TComponentSize) {
		if (this._sizeHelper.value !== value) {
			this._sizeHelper.value = value
		}
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
		const classes = [this._baseClass]

		// Добавляем класс для размера
		classes.push(...this._sizeHelper.getClass())
		// Добавляем класс для варианта, если он задан
		classes.push(...this._variantHelper.getClass())

		return classes
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
			size: this._sizeHelper.value,
		}
	}
}
