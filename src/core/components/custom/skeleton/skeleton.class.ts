import { TStylable } from '../../base/stylable'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import { type TEvented } from '../../../common'
import type {
	ISkeleton,
	ISkeletonProps,
	TSkeletonAnimation,
	TSkeletonEvents,
	TSkeletonShape,
	TSkeletonStates,
} from './types'

export default class TSkeleton
	extends TStylable<ISkeletonProps, TSkeletonEvents>
	implements ISkeleton
{
	static override baseClass = 's-skeleton'

	static defaultValues: Partial<ISkeletonProps> = {
		...TStylable.defaultValues,
		size: 'normal',
		shape: 'rounded',
		animation: 'pulse',
		width: 'auto',
		height: 'auto',
	}

	protected _shape: TSkeletonShape
	protected _animation: TSkeletonAnimation
	protected _width: number | string
	protected _height: number | string

	constructor(
		options:
			| IComponentViewOptions<ISkeletonProps, TSkeletonStates>
			| Partial<ISkeletonProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TSkeleton

		const { props = {} as Partial<ISkeletonProps> } = TComponentView.prepareOptions<
			ISkeletonProps,
			TSkeletonStates
		>(options)

		this._shape = props.shape ?? ctor.defaultValues.shape!
		this._animation = props.animation ?? ctor.defaultValues.animation!
		this._width = props.width ?? ctor.defaultValues.width!
		this._height = props.height ?? ctor.defaultValues.height!

		this._classes.add(`--${this._shape}`)
		this._classes.add(`--${this._animation}`)
	}

	get shape(): TSkeletonShape {
		return this._shape
	}

	set shape(value: TSkeletonShape) {
		if (value === this._shape) return

		this._classes.swapClass({
			oldClass: `--${this._shape}`,
			newClass: `--${value}`,
		})
		this._shape = value
		;(this.events as TEvented<TSkeletonEvents>).emit('change:shape', value)
	}

	get animation(): TSkeletonAnimation {
		return this._animation
	}

	set animation(value: TSkeletonAnimation) {
		if (value === this._animation) return

		this._classes.swapClass({
			oldClass: `--${this._animation}`,
			newClass: `--${value}`,
		})
		this._animation = value
		;(this.events as TEvented<TSkeletonEvents>).emit('change:animation', value)
	}

	get width(): number | string {
		return this._width
	}

	set width(value: number | string) {
		if (value === this._width) return

		this._width = value
		;(this.events as TEvented<TSkeletonEvents>).emit('change:width', value)
	}

	get height(): number | string {
		return this._height
	}

	set height(value: number | string) {
		if (value === this._height) return

		this._height = value
		;(this.events as TEvented<TSkeletonEvents>).emit('change:height', value)
	}

	getProps(): ISkeletonProps {
		return {
			...super.getProps(),
			shape: this._shape,
			animation: this._animation,
			width: this._width,
			height: this._height,
		} as ISkeletonProps
	}
}
