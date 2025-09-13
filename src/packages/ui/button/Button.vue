<script lang="ts">
import { TButton, type IButton } from '../../../core/button'
import { useBaseSetup } from './../../core/useBaseSetup'
import BaseButton, { useButtonWatchers } from './base.component'

// function createSyncPropsToComponent<T extends object>(component: T) {
// 	const prev: Record<string, any> = {}

// 	return (props: Record<string, any>) => {
// 		for (const key in props) {
// 			const newVal = props[key]
// 			const oldVal = prev[key]

// 			if (!Object.is(newVal, oldVal)) {
// 				prev[key] = newVal
// 				if (key in component) {
// 					;(component as any)[key] = newVal
// 				}
// 			}
// 		}
// 	}
// }

// const sync = createSyncPropsToComponent(component)
// sync(props)

// onUpdated(() => {
// 	sync(props)
// })

export default {
	name: '_Button',
	extends: BaseButton,
	setup(props: IButton) {
		const { component } = useBaseSetup(TButton, props)

		useButtonWatchers(props, component)

		return {
			component,
		}
	},
}
</script>

<template>
	{{ component.variant }} - {{ component.appearance }}
	<component :is="component.tag" @click="component.emit('click', $event)">
		<slot>{{ component.text }}</slot>
	</component>
</template>
