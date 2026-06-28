import type {
	IStylable,
	IStylableProps,
	TStylableEvents,
	TStylableStates,
} from '../../base/stylable'

export type TSkeletonShape = 'rect' | 'rounded' | 'circle'

export type TSkeletonAnimation = 'pulse' | 'wave' | 'none'

export interface ISkeletonProps extends IStylableProps {
	shape?: TSkeletonShape
	animation?: TSkeletonAnimation
	width?: number | string
	height?: number | string
}

export type TSkeletonStates = TStylableStates

export type TSkeletonEvents = TStylableEvents & {
	'change:shape': (value: TSkeletonShape) => void
	'change:animation': (value: TSkeletonAnimation) => void
	'change:width': (value: number | string) => void
	'change:height': (value: number | string) => void
}

export interface ISkeleton
	extends IStylable<ISkeletonProps, TSkeletonEvents, TSkeletonStates> {
	shape: TSkeletonShape
	animation: TSkeletonAnimation
	width: number | string
	height: number | string
}
