import { TComponent, defaultValuesComponent, type IComponentOptions } from '../component'
import type { IIcon, TIconEventsMap, TIconSize } from './types'
import type { TObjectProps } from '../object'
import { TSize } from '@/core/common/size'

export const defaultValues: Partial<IIcon> = {
	...defaultValuesComponent,
	size: 'normal',
	tag: 'error',
}

export default class TIcon extends TComponent<TIconEventsMap> implements IIcon {
	protected _width: string | number | undefined
	protected _height: string | number | undefined
	protected _sizeHelper: TSize<TIconSize>

	constructor(options: IComponentOptions<IIcon>) {
		const { props = {}, baseClass = 's-icon' } = options

		super({ props, baseClass })

		this._sizeHelper = new TSize<TIconSize>({
			baseClass: this._baseClass,
			exclude: ['auto'],
			value: props.size ?? defaultValues.size!,
		})

		this._tag = props.tag ?? defaultValues.tag!
		this._width = props.width
		this._height = props.height
	}

	get width(): string | number | undefined {
		return this._width
	}

	set width(value: string | number | undefined) {
		if (this._width !== value) {
			this._width = value
		}
	}

	get height(): string | number | undefined {
		return this._height
	}

	set height(value: string | number | undefined) {
		if (this._height !== value) {
			this._height = value
		}
	}

	get size(): TIconSize {
		return this._sizeHelper.value
	}

	set size(value: TIconSize) {
		if (this._sizeHelper.value !== value) {
			this._sizeHelper.value = value
		}
	}

	get classes(): string[] {
		const classes = [this._baseClass]

		// Добавляем класс для размера
		classes.push(...this._sizeHelper.getClass())

		return classes
	}

	/**
	 * Получает экземпляр иконки.
	 * @param value Значение, по которому нужно получить иконку, если это уже экземпляр TIcon, он будет возвращен как есть, иначе будет создан новый экземпляр.
	 * @returns Экземпляр иконки.
	 */
	static getInstance(value: TIcon | Object): TIcon {
		if (value instanceof TIcon) {
			return value
		}

		return new TIcon({ props: { tag: value } })
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			size: this._sizeHelper.value,
			width: this._width,
			height: this._height,
		}
	}
}
