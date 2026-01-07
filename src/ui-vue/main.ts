import { createApp, defineComponent, h, ref } from 'vue'
import Presentable from './components/presentable/Presentable.vue'

const App = defineComponent({
	name: 'UiVuePlayground',
	setup() {
		const rendered = ref(true)
		const visible = ref(true)

		return () =>
			h('div', [
				h('h1', { 'data-testid': 'ui-playground-title' }, 'UI Vue Playground'),
				h(
					'button',
					{
						type: 'button',
						onClick: () => (rendered.value = !rendered.value),
						'data-testid': 'toggle-rendered',
					},
					`rendered: ${rendered.value}`,
				),
				h(
					'button',
					{
						type: 'button',
						onClick: () => (visible.value = !visible.value),
						'data-testid': 'toggle-visible',
					},
					`visible: ${visible.value}`,
				),
				h(
					Presentable,
					{
						tag: 'div',
						rendered: rendered.value,
						visible: visible.value,
						'data-testid': 'presentable',
					},
					{ default: () => 'Presentable content' },
				),
			])
	},
})

createApp(App).mount('#app')
