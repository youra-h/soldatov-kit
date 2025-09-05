<script lang="ts">
import { defineComponent, watch } from 'vue'
import { TButton, type IButton, type TButtonAppearance } from '../../../core/button'
import { type TVariant } from '../../../core/utils/types'
import { baseSetup } from '../component'
import BaseButton from './base.component'

export default defineComponent({
	name: '_Button',
	extends: BaseButton,
	setup(props: IButton) {
		const { component } = baseSetup(TButton, props)

		watch<TVariant | undefined>(
			() => props.variant,
			(value) => {
				if (value && value !== component.variant) {
					component.variant = value
				}
			},
		)
		watch<TButtonAppearance | undefined>(
			() => props.appearance,
			(value) => {
				if (value && value !== component.appearance) {
					component.appearance = value
				}
			},
		)

		return {
			component,
		}
	},
})
</script>

<template>
	<component :is="component.tag" @click="component.emit('click', $event)">
		<slot />
	</component>
</template>
