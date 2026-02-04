<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './PlaygroundLayout.vue'
import Properties from './common/Properties.vue'
import type { TPropertiesSchema } from './common/Properties.vue'
import PropsDemo from './icon/Component.vue'
import InstanceDemo from './icon/Instance.vue'
import SlotsDemo from './icon/Slots.vue'
import { SIZES, ICON_PATHS } from './common/items'

// Схема свойств для Icon
const propertiesSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	tag: { type: 'select', default: '/src/icons/home.svg', options: ICON_PATHS },
	size: { type: 'select', default: 'normal', options: SIZES },
	width: { type: 'string', placeholder: 'auto' },
	height: { type: 'string', placeholder: 'auto' },
}

// Component properties state
const componentProps = ref({
	visible: true,
	rendered: true,
	tag: '/src/icons/home.svg',
	size: 'normal',
	width: undefined,
	height: undefined,
})

// Ref для Instance demo
const instanceDemoRef = ref<InstanceType<typeof InstanceDemo>>()

const handleShow = () => {
	instanceDemoRef.value?.show()
}

const handleHide = () => {
	instanceDemoRef.value?.hide()
}
</script>

<template>
	<PlaygroundLayout title="Icon Playground">
		<template #properties>
			<Properties
				v-model="componentProps"
				:schema="propertiesSchema"
				@show="handleShow"
				@hide="handleHide"
			/>
		</template>

		<template #props-demo>
			<PropsDemo v-bind="componentProps" />
		</template>

		<template #instance-demo>
			<InstanceDemo ref="instanceDemoRef" v-bind="componentProps" />
		</template>

		<template #slots-demo>
			<SlotsDemo v-bind="componentProps" />
		</template>
	</PlaygroundLayout>
</template>
