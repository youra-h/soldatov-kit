import { TComponent, defaultValuesComponent, type IComponentOptions } from '../component'
import type { TComponentSize, TComponentVariant } from '../../common/types'
import type { ISpinner, TSpinnerEventsMap } from './types'
import type { TObjectProps } from '../object'
import { TSize } from '@/core/common/size'
import { TVariant } from '../../common/variant'

export const defaultValues: Partial<ISpinner> = {
	...defaultValuesComponent,
	variant: 'primary',
	size: 'normal',
	tag: 'span',
	borderWidth: 'auto',
}

export default class TSpinner extends TComponent<TSpinnerEventsMap> implements ISpinner {
	protected _sizeHelper: TSize<TComponentSize>
	protected _variantHelper: TVariant
	protected _borderWidth: number | 'auto'

	constructor(options: IComponentOptions<ISpinner>) {
		options = TComponent.prepareOptions(options, 's-spinner')

		super(options)

		const { props = {} } = options

		this._sizeHelper = new TSize<TComponentSize>({
			baseClass: this._baseClass,
			exclude: ['normal'],
			value: defaultValues.size!,
		})

		this._variantHelper = new TVariant({
			baseClass: this._baseClass,
			exclude: ['normal'],
			value: props.variant ?? defaultValues.variant!,
		})

		this._tag = props.tag ?? defaultValues.tag!
		this._borderWidth = props.borderWidth ?? defaultValues.borderWidth!
		this.size = props.size ?? defaultValues.size!
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

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			size: this._sizeHelper.value,
		}
	}
}
