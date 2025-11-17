import { TComponent, type IComponentOptions } from '../component'
import type { IIcon, IIconProps, TIconEvents } from './types'
import { TSize } from '../../common/size'
import type { TComponentSize } from '../../common/types'

export default class TIcon extends TComponent<IIconProps, TIconEvents> implements IIcon {
	static defaultValues: Partial<IIconProps> = {
		...TComponent.defaultValues,
		size: 'normal',
		tag: 'error',
	}

	protected _width: string | number | undefined
	protected _height: string | number | undefined
	protected _sizeHelper: TSize

	constructor(options: IComponentOptions<IIconProps> | Partial<IIconProps> = {}) {
		options = TComponent.prepareOptions(options, 's-icon')

		super(options)

		const { props = {} } = options

		this._sizeHelper = new TSize({
			baseClass: this._baseClass,
			exclude: ['auto'],
			value: props.size ?? TIcon.defaultValues.size!,
		})

		this._tag = props.tag ?? TIcon.defaultValues.tag!
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

	get size(): TComponentSize {
		return this._sizeHelper.value
	}

	set size(value: TComponentSize) {
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

		// Если value - объект, создаем новый экземпляр с его свойствами
		if (value && value instanceof Object && 'tag' in value) {
			return new TIcon({ props: value as any })
		}

		// Иначе value - это объект с иконкой
		return new TIcon({ props: { tag: value } })
	}

	getProps(): IIconProps {
		return {
			...super.getProps(),
			size: this._sizeHelper.value,
			width: this._width,
			height: this._height,
		}
	}
}
