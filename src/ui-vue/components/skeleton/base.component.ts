import { type PropType, watch, type Ref } from 'vue'
import {
	type ISkeletonProps,
	TSkeleton,
	type ISkeleton,
	type TSkeletonShape,
	type TSkeletonAnimation,
} from '@core'
import {
	BaseStylable,
	emitsStylable,
	propsStylable,
	syncStylable,
	type IStylableState,
} from '../stylable'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types/common'
import { useSyncProps } from '../../composables/useSyncProps'
import { useInheritProps } from '../../composables/useInheritProps'

export const emitsSkeleton: TEmits = [
	...emitsStylable,
	'change:shape',
	'update:shape',
	'change:animation',
	'update:animation',
	'change:width',
	'update:width',
	'change:height',
	'update:height',
] as const

export const propsSkeleton: TProps = {
	...useInheritProps(propsStylable, TSkeleton),
	shape: {
		type: String as PropType<ISkeletonProps['shape']>,
		default: TSkeleton.defaultValues.shape,
	},
	animation: {
		type: String as PropType<ISkeletonProps['animation']>,
		default: TSkeleton.defaultValues.animation,
	},
	width: {
		type: [String, Number] as PropType<ISkeletonProps['width']>,
		default: TSkeleton.defaultValues.width,
	},
	height: {
		type: [String, Number] as PropType<ISkeletonProps['height']>,
		default: TSkeleton.defaultValues.height,
	},
}

export default {
	name: 'BaseSkeleton',
	extends: BaseStylable,
	emits: emitsSkeleton,
	props: propsSkeleton,
}

export interface ISkeletonState extends IStylableState {
	shape: Ref<TSkeletonShape>
	animation: Ref<TSkeletonAnimation>
	width: Ref<number | string>
	height: Ref<number | string>
}

export function syncSkeleton(
	options: ISyncComponentOptions<ISkeletonProps, ISkeleton>,
): ISkeletonState {
	const syncProps = syncStylable(options)

	const { instance, props, emit } = options

	instance.events.on('change:shape', (value: TSkeletonShape) => {
		emit?.('change:shape', value)
		emit?.('update:shape', value)
	})
	instance.events.on('change:animation', (value: TSkeletonAnimation) => {
		emit?.('change:animation', value)
		emit?.('update:animation', value)
	})
	instance.events.on('change:width', (value: number | string) => {
		emit?.('change:width', value)
		emit?.('update:width', value)
	})
	instance.events.on('change:height', (value: number | string) => {
		emit?.('change:height', value)
		emit?.('update:height', value)
	})

	watch<TSkeletonShape | undefined>(
		() => props.shape,
		(value) => {
			if (value !== undefined && value !== instance.shape) {
				instance.shape = value
			}
		},
	)

	watch<TSkeletonAnimation | undefined>(
		() => props.animation,
		(value) => {
			if (value !== undefined && value !== instance.animation) {
				instance.animation = value
			}
		},
	)

	watch<number | string | undefined>(
		() => props.width,
		(value) => {
			if (value !== undefined && value !== instance.width) {
				instance.width = value
			}
		},
	)

	watch<number | string | undefined>(
		() => props.height,
		(value) => {
			if (value !== undefined && value !== instance.height) {
				instance.height = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			shape: () => instance.shape,
			animation: () => instance.animation,
			width: () => instance.width,
			height: () => instance.height,
		}),
	}
}
