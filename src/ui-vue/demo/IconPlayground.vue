<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './PlaygroundLayout.vue'
import PropertiesPanel from './icon/Properties.vue'
import PropsDemo from './icon/Component.vue'
import InstanceDemo from './icon/Instance.vue'
import SizesDemo from './icon/Sizes.vue'
import type { TComponentSize } from './common/SizeSelector.vue'

// Component properties state
const componentProps = ref<{
	visible: boolean
	rendered: boolean
	tag: string
	size: TComponentSize
	width?: number | string
	height?: number | string
}>({
	visible: true,
	rendered: true,
	tag: '/src/icons/home.svg',
	size: 'normal',
	width: undefined,
	height: undefined,
})

const handlePropsChange = (newProps: Partial<typeof componentProps.value>) => {
	componentProps.value = { ...componentProps.value, ...newProps }
}
</script>

<template>
	<PlaygroundLayout title="Icon Playground">
		<template #properties>
			<PropertiesPanel v-bind="componentProps" @change="handlePropsChange" />
		</template>

		<!-- <template #props-demo>
			<PropsDemo v-bind="componentProps" />
		</template> -->

		<template #instance-demo>
			<InstanceDemo v-bind="componentProps" />
		</template>

		<!-- <template #slots-demo>
			<SizesDemo v-bind="componentProps" />
		</template> -->
	</PlaygroundLayout>
</template>
