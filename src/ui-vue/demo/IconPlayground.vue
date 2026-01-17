<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './PlaygroundLayout.vue'
import PropertiesPanel from './icon/Properties.vue'
import PropsDemo from './icon/Component.vue'
import InstanceDemo from './icon/Instance.vue'
import SizesDemo from './icon/Sizes.vue'
import type { TComponentSize } from './common/SizeSelector.vue'

// Ref для Instance demo
const instanceDemoRef = ref<InstanceType<typeof InstanceDemo>>()

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

const handleShow = () => {
	// Для Props demo просто меняем visible
	componentProps.value = { ...componentProps.value, visible: true }
	// Для Instance demo вызываем метод show()
	instanceDemoRef.value?.show()
}

const handleHide = () => {
	// Для Props demo просто меняем visible
	componentProps.value = { ...componentProps.value, visible: false }
	// Для Instance demo вызываем метод hide()
	instanceDemoRef.value?.hide()
}
</script>

<template>
	<PlaygroundLayout title="Icon Playground">
		<template #properties>
			<PropertiesPanel v-bind="componentProps" @change="handlePropsChange" @show="handleShow" @hide="handleHide" />
		</template>

		<template #props-demo>
			<PropsDemo v-bind="componentProps" />
		</template>

		<template #instance-demo>
			<InstanceDemo ref="instanceDemoRef" v-bind="componentProps" />
		</template>

		<!-- <template #slots-demo>
			<SizesDemo v-bind="componentProps" />
		</template> -->
	</PlaygroundLayout>
</template>
