import type { TControlSize } from './types'

export class SizeHelper {
	protected _size: TControlSize = 'normal'

	get size(): TControlSize {
		return this._size
	}
	set size(value: TControlSize) {
		this._size = value
	}

	getSizeClass(baseClass: string): string[] {
		return this._size && this._size !== 'normal' ? [`${baseClass}--size-${this._size}`] : []
	}
}
