import { TComponent, defaultComponentValues } from '../component'
import type { TControlSize } from '../../common/types'
import type { IIcon, TIconEventsMap } from './types'
import type { TObjectProps } from '../object'

export const defaultValues: Partial<IIcon> = {
	...defaultComponentValues,
	size: 'normal',
}

export default class TIcon extends TComponent<TIconEventsMap> implements IIcon {
	private _size: TControlSize
	private _width: string | number | undefined
	private _height: string | number | undefined

	constructor(props: Partial<IIcon> = {}) {
		super(props)

		this._baseClass = 's-icon'

		this._tag = 'svg'

		this._size = props.size ?? defaultValues.size!
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

	get size(): TControlSize {
		return this._size
	}

	set size(value: TControlSize) {
		if (this._size !== value) {
			this._size = value
		}
	}

	get classes(): string[] {
		const classes = []

		// Добавляем класс для размера
		if (this.size && this.size !== 'normal') {
			classes.push(`${this._baseClass}--size-${this.size}`)
		}

		return classes
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			size: this._size,
			width: this._width,
			height: this._height,
		}
	}
}
