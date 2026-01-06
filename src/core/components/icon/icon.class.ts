import { type IComponentModelOptions } from '../../base/component-model'
import { TPresentable } from '../../base/presentable'
import type { IIcon, IIconProps, TIconEvents } from './types'
import { TSizeState } from '../../base/states/size.state'
import type { TComponentSize } from '../../common/types'

export default class TIcon extends TPresentable<IIconProps, TIconEvents> implements IIcon {
	static defaultValues: Partial<IIconProps> = {
		...TPresentable.defaultValues,
		size: 'normal',
		tag: 'error',
	}

	protected _width: string | number | undefined
	protected _height: string | number | undefined
	readonly sizeState: TSizeState

	constructor(options: IComponentModelOptions<IIconProps> | Partial<IIconProps> = {}) {
		super(options as any)

		const { props = {} } = options

		this.sizeState = new TSizeState({
			baseClass: this._baseClass,
			exclude: ['auto'],
			value: (props.size ?? TIcon.defaultValues.size!) as TComponentSize,
		})
		this.sizeState.events.on('change', (value) => {
			this.events.emit('change:size' as any, value)
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
		return this.sizeState.value
	}

	set size(value: TComponentSize) {
		this.sizeState.value = value
	}

	get classes(): string[] {
		return [...super.classes, ...this.sizeState.getClass()]
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
			size: this.sizeState.value,
			width: this._width,
			height: this._height,
		}
	}
}
