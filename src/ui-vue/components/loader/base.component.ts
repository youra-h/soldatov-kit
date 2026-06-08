import { type PropType, watch } from 'vue'
import {
	type ILoaderProps,
	TLoader,
	type TComponentSize,
	type TComponentVariant,
	type TLoaderIndicator,
	type ILoader,
} from '@core'
import {
	ComponentView,
	emitsComponentView,
	propsComponentView,
	syncComponentView,
} from '../component-view'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types/common'

export const emitsLoader: TEmits = [
	...emitsComponentView,
	'change:loader',
	'update:loader',
	'change:shouldDisable',
	'update:shouldDisable',
	'change:shouldIndicator',
	'update:shouldIndicator',
] as const

export const propsLoader: TProps = {
	...propsComponentView,
	loader: {
		type: String as PropType<TLoaderIndicator>,
		default: TLoader.defaultValues.loader,
	},
	size: {
		type: String as PropType<TComponentSize>,
		default: TLoader.defaultValues.size,
	},
	variant: {
		type: String as PropType<TComponentVariant>,
		default: TLoader.defaultValues.variant,
	},
	shouldDisable: {
		type: Boolean,
		default: TLoader.defaultValues.shouldDisable,
	},
	shouldIndicator: {
		type: Boolean,
		default: TLoader.defaultValues.shouldIndicator,
	},
}

export default {
	name: 'BaseLoader',
	extends: ComponentView,
	emits: emitsLoader,
	props: propsLoader,
}

export function syncLoader(
	options: ISyncComponentModelOptions<ILoaderProps, ILoader>,
) {
	const syncProps = syncComponentView(options)
	const { instance, props, emit } = options

	// События наружу
	instance.events.on('change:loader', (value: TLoaderIndicator) => {
		emit?.('change:loader', value)
		emit?.('update:loader', value)
	})
	instance.events.on('change:shouldDisable', (value: boolean) => {
		emit?.('change:shouldDisable', value)
		emit?.('update:shouldDisable', value)
	})
	instance.events.on('change:shouldIndicator', (value: boolean) => {
		emit?.('change:shouldIndicator', value)
		emit?.('update:shouldIndicator', value)
	})

	// Props → instance
	watch(() => props.loader, (v) => { if (v !== undefined) instance.loader = v })
	watch(() => props.shouldDisable, (v) => { if (v !== undefined) instance.shouldDisable = v })
	watch(() => props.shouldIndicator, (v) => { if (v !== undefined) instance.shouldIndicator = v })

	// size/variant не смотрятся из props — они синхронизируются из дочерних контролов (Button)

	return syncProps
}

