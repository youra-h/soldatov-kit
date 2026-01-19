<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './PlaygroundLayout.vue'
import PropertiesPanel from './spinner/Properties.vue'
import PropsDemo from './spinner/Component.vue'
import InstanceDemo from './spinner/Instance.vue'
import SizesDemo from './spinner/Sizes.vue'
import type { TComponentSize } from './common/SizeSelector.vue'
import type { TComponentVariant } from './common/VariantSelector.vue'

// Ref для Instance demo
const instanceDemoRef = ref<InstanceType<typeof InstanceDemo>>()

// Component properties state
const componentProps = ref<{
	visible: boolean
	rendered: boolean
	size: TComponentSize
	variant: TComponentVariant
}>({
	visible: true,
	rendered: true,
	size: 'normal',
	variant: 'normal',
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
	<PlaygroundLayout title="Spinner Playground">
		<template #properties>
			<PropertiesPanel v-bind="componentProps" @change="handlePropsChange" @show="handleShow" @hide="handleHide" />
		</template>

		<template #props-demo>
			<PropsDemo v-bind="componentProps" />
		</template>

		<template #instance-demo>
			<InstanceDemo ref="instanceDemoRef" v-bind="componentProps" />
		</template>

		<template #slots-demo>
			<SizesDemo v-bind="componentProps" />
		</template>
	</PlaygroundLayout>
</template>
