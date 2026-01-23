<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './PlaygroundLayout.vue'
import PropertiesPanel from './button/Properties.vue'
import PropsDemo from './button/Component.vue'
import InstanceDemo from './button/Instance.vue'
import AppearancesDemo from './button/Appearances.vue'
import type { TComponentSize } from './common/SizeSelector.vue'
import type { TComponentVariant } from './common/VariantSelector.vue'
import type { TButtonAppearance } from '@core'

// Ref для Instance demo
const instanceDemoRef = ref<InstanceType<typeof InstanceDemo>>()

// Component properties state
const componentProps = ref<{
	visible: boolean
	rendered: boolean
	size: TComponentSize
	variant: TComponentVariant
	appearance: TButtonAppearance
	disabled: boolean
	loading: boolean
	loadingShouldDisable: boolean
	spinnerType: 'default' | 'small' | 'large' | 'primary' | 'danger'
	text: string
	icon: string
}>({
	visible: true,
	rendered: true,
	size: 'normal',
	variant: 'normal',
	appearance: 'normal',
	disabled: false,
	loading: false,
	loadingShouldDisable: true,
	spinnerType: 'default',
	text: 'Button',
	icon: '',
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
	<PlaygroundLayout title="Button Playground">
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
			<AppearancesDemo :size="componentProps.size" :variant="componentProps.variant" />
		</template>
	</PlaygroundLayout>
</template>
