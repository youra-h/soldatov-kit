import { type PropType, watch, type Ref } from 'vue'
import {
	type ILoaderProps,
	TLoader,
	type TComponentSize,
	type TComponentVariant,
	type TLoaderType,
	type ILoader,
	type TValuePayload,
} from '@core'
import { BaseComponentModel, emitsComponentModel, propsComponentModel } from '../component-model'
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../types/common'
import { useSyncProps } from '../../composables/useSyncProps'
import { useProvideLoader } from '../../composables/useLoader'

export const emitsLoader: TEmits = [
	...emitsComponentModel,
	'change:visible',
	'update:visible',
	'change:type',
	'update:type',
	'change:size',
	'update:size',
	'change:variant',
	'update:variant',
	'change:loader',
	'update:loader',
	'change:block',
	'update:block',
	'change:indicator',
	'update:indicator',
] as const

export const propsLoader: TProps = {
	...propsComponentModel,
	visible: {
		type: Boolean as PropType<ILoaderProps['visible']>,
		default: TLoader.defaultValues.visible,
	},
	type: {
		type: String as PropType<TLoaderType>,
		default: TLoader.defaultValues.type,
	},
	size: {
		type: String as PropType<TComponentSize>,
		default: TLoader.defaultValues.size,
	},
	variant: {
		type: String as PropType<TComponentVariant>,
		default: TLoader.defaultValues.variant,
	},
	block: {
		type: Boolean as PropType<ILoaderProps['block']>,
		default: TLoader.defaultValues.block,
	},
	indicator: {
		type: Boolean as PropType<ILoaderProps['indicator']>,
		default: TLoader.defaultValues.indicator,
	},
}

export default {
	name: 'BaseLoader',
	extends: BaseComponentModel,
	emits: emitsLoader,
	props: propsLoader,
}

export interface ILoaderState {
	type: Ref<TLoaderType>
	size: Ref<TComponentSize>
	variant: Ref<TComponentVariant>
	block: Ref<boolean>
	indicator: Ref<boolean>
}

export function syncLoader(options: ISyncComponentViewOptions<ILoaderProps, ILoader>) {
	const { instance, props, emit } = options

	useProvideLoader(instance)

	// События наружу
	instance.events.on('change:visible', (value: boolean) => {
		emit?.('change:visible', value)
		emit?.('update:visible', value)
	})
	instance.events.on('change:type', (value: TLoaderType) => {
		emit?.('change:type', value)
		emit?.('update:type', value)
	})
	instance.events.on('change:size', (payload: TValuePayload<TComponentSize>) => {
		emit?.('change:size', payload)
		emit?.('update:size', payload)
	})
	instance.events.on('change:variant', (payload: TValuePayload<TComponentVariant>) => {
		emit?.('change:variant', payload)
		emit?.('update:variant', payload)
	})

	instance.events.on('change:block', (value: boolean) => {
		emit?.('change:block', value)
		emit?.('update:block', value)
	})
	instance.events.on('change:indicator', (value: boolean) => {
		emit?.('change:indicator', value)
		emit?.('update:indicator', value)
	})

	// Props → instance
	watch<boolean | undefined>(
		() => props.visible,
		(value) => {
			if (value !== undefined && value !== instance.visible) {
				instance.visible = value
			}
		},
	)

	watch<TLoaderType | undefined>(
		() => props.type,
		(value) => {
			if (value !== undefined && value !== instance.type) {
				instance.type = value
			}
		},
	)

	watch<TComponentVariant | undefined>(
		() => props.variant,
		(value) => {
			if (value !== undefined && value !== instance.variant) {
				instance.variant = value
			}
		},
	)

	watch<TComponentSize | undefined>(
		() => props.size,
		(value) => {
			if (value !== undefined && value !== instance.size) {
				instance.size = value
			}
		},
	)

	watch<boolean | undefined>(
		() => props.block,
		(value) => {
			if (value !== undefined && value !== instance.block) {
				instance.block = value
			}
		},
	)
	watch<boolean | undefined>(
		() => props.indicator,
		(value) => {
			if (value !== undefined && value !== instance.indicator) {
				instance.indicator = value
			}
		},
	)

	return {
		...useSyncProps(instance.events as any, {
			visible: () => instance.visible,
			type: () => instance.type,
			size: () => instance.size,
			variant: () => instance.variant,
			block: () => instance.block,
			indicator: () => instance.indicator,
		}),
	}
}
