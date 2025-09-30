<script lang="ts">
import { TSwitch, type ISwitch } from '../../../core'
import BaseSwitch, { syncSwitch } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'
import { Icon, useIconImport } from '../icon'
import { TIcon } from '../../../core'

export default {
	name: '_Switch',
	extends: BaseSwitch,
	setup(props: ISwitch, { emit }) {
		const { is: component } = useBaseSetup(TSwitch, props)

		syncSwitch({
			props,
			instance: component,
			emit,
		})

		if (!component.icon) {
			component.icon = TIcon.create({
				tag: useIconImport('/src/packages/icons/check.svg'),
			})
		}

		return { component }
	},
}
</script>

<template>
	<div :class="component.classes">
		<input
			type="checkbox"
			:id="component.id.toString()"
			:checked="component.value || undefined"
			:name="component.name"
			:disabled="component.disabled"
			:readonly="component.readonly"
			:required="component.required"
			:aria-checked="component.value"
			@change="component.change($event)"
		/>
		<div class="s-switch__track">
			<div class="s-switch__thumb">
				<Icon v-if="component.icon" :icon="component.icon" class="s-switch__icon" />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use './mixines' as mixines;
@reference "./../../theme";

.s-switch {
	$this: &;
}
</style>
