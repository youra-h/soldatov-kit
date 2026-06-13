import { type PropType, markRaw, watch, type Ref, reactive } from 'vue'
import {
	type ILoaderProps,
	TLoader,
	type TComponentSize,
	type TComponentVariant,
	type TLoaderType,
	type ILoader,
	type TValuePayload,
	type TLoaderTypeIndicator,
} from '@core'
import { BaseComponentModel, emitsComponentModel, propsComponentModel } from '../component-model'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types/common'
import { useSyncProps } from '../../composables/useSyncProps'
import {
	useProvideLoader,
	useInjectLoader,
	useResolveIndicatorComponent,
} from '../../composables/useLoader'

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
	'change:disabled',
	'update:disabled',
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
	disabled: {
		type: Boolean as PropType<ILoaderProps['disabled']>,
		default: TLoader.defaultValues.disabled,
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
	disabled: Ref<boolean>
	indicator: Ref<boolean>
}

export function syncLoader(options: ISyncComponentModelOptions<ILoaderProps, ILoader>) {
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

	instance.events.on('change:disabled', (value: boolean) => {
		emit?.('change:disabled', value)
		emit?.('update:disabled', value)
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
		() => props.disabled,
		(value) => {
			if (value !== undefined && value !== instance.disabled) {
				instance.disabled = value
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
			disabled: () => instance.disabled,
			indicator: () => instance.indicator,
		}),
	}
}

export interface ILoaderContextState {
	visible: boolean
	type: TLoaderType
	disabled: boolean
	size: TComponentSize
	variant: TComponentVariant
	indicator: boolean
	hasIndicator: boolean
	ctrl: TLoaderTypeIndicator
	component: any
}

export type TSyncLoaderContext = {
	loader?: ILoader
	context?: ILoaderContextState
}

/**
 * Синхронизация контекста загрузчика для компонентов, которые его поддерживают (например, Control).
 * @returns Объект с текущим состоянием загрузчика и его инстансом (если он есть в иерархии компонентов)
 */
export function syncLoaderContext(): TSyncLoaderContext {
	const { loader } = useInjectLoader() || {}

	if (!loader) {
		return {}
	}

	const indicatorComponent = useResolveIndicatorComponent(loader.type)

	const context = reactive({
		...useSyncProps(loader.events as any, {
			visible: () => loader.visible,
			type: () => loader.type,
			disabled: () => loader.disabled,
			size: () => loader.size,
			variant: () => loader.variant,
			indicator: () => loader.indicator,
			hasIndicator: {
				value: () => loader.visible && loader.indicator,
				triggers: ['change:visible', 'change:indicator'],
			},
		}),
		ctrl: loader.ctrl ? markRaw(loader.ctrl) : null,
		component: indicatorComponent ? markRaw(indicatorComponent) : null,
	}) as ILoaderContextState

	return { loader, context }
}
