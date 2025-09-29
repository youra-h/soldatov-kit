<script lang="ts">
import { TCheckBox, type ICheckBox } from '../../../core'
import BaseCheckBox, { syncCheckBox } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'

export default {
	name: '_CheckBox',
	extends: BaseCheckBox,
	setup(props: ICheckBox, { emit }) {
		const { is: component } = useBaseSetup(TCheckBox, props)

		syncCheckBox({
			props,
			instance: component,
			emit,
		})

		return { component }
	},
}
</script>

<template>
	<div :class="component.classes">
		<input type="checkbox" :id="component.id.toString()" :name="component.name" :disabled="component.disabled" />
	</div>
</template>
