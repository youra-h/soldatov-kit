import type { PropType } from 'vue'
import { watch } from 'vue'
import {
	type ITabs,
	type ITabsProps,
	TTabs,
	type TTabsOrientation,
	type TTabsAlignment,
	type TTabsPosition,
	type TTabsAppearance,
	type ITabItem,
} from '../../../core'
import { BaseControl, emitsControl, propsControl, syncControl } from '../control'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'

export const emitsTabs: TEmits = [
	...emitsControl,
	'change:orientation',
	'update:orientation',
	'change:alignment',
	'update:alignment',
	'change:position',
	'update:position',
	'change:appearance',
	'update:appearance',
	'change:stretched',
	'update:stretched',
	'change:closable',
	'update:closable',
	'tab:added',
	'tab:removed',
	'tab:close',
	'tab:activated',
	'change:count',
	'change:activeItem',
] as const

export const propsTabs: TProps = {
	...propsControl,
	orientation: {
		type: String as PropType<TTabsOrientation>,
		default: TTabs.defaultValues.orientation,
	},
	alignment: {
		type: String as PropType<TTabsAlignment>,
		default: TTabs.defaultValues.alignment,
	},
	position: {
		type: String as PropType<TTabsPosition>,
		default: TTabs.defaultValues.position,
	},
	appearance: {
		type: String as PropType<TTabsAppearance>,
		default: TTabs.defaultValues.appearance,
	},
	stretched: {
		type: Boolean as PropType<ITabsProps['stretched']>,
		default: TTabs.defaultValues.stretched,
	},
	closable: {
		type: Boolean as PropType<ITabsProps['closable']>,
		default: TTabs.defaultValues.closable,
	},
	activeItem: {
		type: Object as PropType<ITabItem | undefined>,
		default: undefined,
	},
	count: {
		type: Number,
		default: 0,
	},
}

export default {
	name: 'BaseTabs',
	extends: BaseControl,
	emits: emitsTabs,
	props: propsTabs,
}

/**
 * Синхронизация props и событий для Tabs
 */
export function syncTabs(options: ISyncComponentModelOptions<ITabsProps, ITabs>) {
	syncControl(options)

	const { props, instance, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on('change:orientation', (value: TTabsOrientation) => {
		emit?.('change:orientation', value)
		emit?.('update:orientation', value)
	})

	instance.events.on('change:alignment', (value: TTabsAlignment) => {
		emit?.('change:alignment', value)
		emit?.('update:alignment', value)
	})

	instance.events.on('change:position', (value: TTabsPosition) => {
		emit?.('change:position', value)
		emit?.('update:position', value)
	})

	instance.events.on('change:appearance', (value: TTabsAppearance) => {
		emit?.('change:appearance', value)
		emit?.('update:appearance', value)
	})

	instance.events.on('change:stretched', (value: boolean) => {
		emit?.('change:stretched', value)
		emit?.('update:stretched', value)
	})

	instance.events.on('change:closable', (value: boolean) => {
		emit?.('change:closable', value)
		emit?.('update:closable', value)
	})

	instance.events.on('tab:added', (item: ITabItem) => {
		emit?.('tab:added', item)
		emit?.('change:count', instance.count)
	})

	instance.events.on('tab:removed', (item: ITabItem) => {
		emit?.('tab:removed', item)
		emit?.('change:count', instance.count)
	})

	instance.events.on('tab:close', (item: ITabItem) => {
		emit?.('tab:close', item)
	})

	instance.events.on('tab:activated', (item: ITabItem | undefined) => {
		emit?.('tab:activated', item)
		emit?.('change:activeItem', instance.activeItem)
	})

	// Watch props
	watch<TTabsOrientation | undefined>(
		() => props.orientation,
		(value) => {
			if (value !== undefined && value !== instance.orientation) {
				instance.orientation = value
			}
		},
	)

	watch<TTabsAlignment | undefined>(
		() => props.alignment,
		(value) => {
			if (value !== undefined && value !== instance.alignment) {
				instance.alignment = value
			}
		},
	)

	watch<TTabsPosition | undefined>(
		() => props.position,
		(value) => {
			if (value !== undefined && value !== instance.position) {
				instance.position = value
			}
		},
	)

	watch<TTabsAppearance | undefined>(
		() => props.appearance,
		(value) => {
			if (value !== undefined && value !== instance.appearance) {
				instance.appearance = value
			}
		},
	)

	watch<boolean | undefined>(
		() => props.stretched,
		(value) => {
			if (value !== undefined && value !== instance.stretched) {
				instance.stretched = value
			}
		},
	)

	watch<boolean | undefined>(
		() => props.closable,
		(value) => {
			if (value !== undefined && value !== instance.closable) {
				instance.closable = value
			}
		},
	)
}
