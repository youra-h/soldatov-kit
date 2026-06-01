<script lang="ts">
import { TComponentModel, type IComponentModelProps } from '@core'
import BaseDragAndDrop from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useProvideDragContext } from '../../composables/useDragContext'
import type { TBaseComponentModelProps } from '../component-model'

export default {
	name: '_DragAndDrop',
	extends: BaseDragAndDrop,
	setup(props: TBaseComponentModelProps<IComponentModelProps>) {
		const instance = useInstance(TComponentModel, props)
		useProvideDragContext()
		return { instance }
	},
}
</script>

<template>
	<slot />
</template>
