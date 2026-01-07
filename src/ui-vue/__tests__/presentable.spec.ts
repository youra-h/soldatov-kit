import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Presentable from '../components/presentable/Presentable.vue'

describe('ui-vue: Presentable', () => {
	it('рендерится в DOM при rendered=true', () => {
		const wrapper = mount(Presentable, {
			props: {
				tag: 'div',
				rendered: true,
				visible: true,
			},
			slots: {
				default: 'Hello',
			},
		})

		expect(wrapper.text()).toContain('Hello')
		expect(wrapper.find('div').exists()).toBe(true)
	})

	it('не рендерится в DOM при rendered=false', () => {
		const wrapper = mount(Presentable, {
			props: {
				tag: 'div',
				rendered: false,
				visible: true,
			},
			slots: {
				default: 'Hello',
			},
		})

		// Vue оставляет comment node вместо элемента
		expect(wrapper.text()).not.toContain('Hello')
		expect(wrapper.html()).toContain('v-if')
	})

	it('v-show прячет элемент при visible=false', () => {
		const wrapper = mount(Presentable, {
			props: {
				tag: 'div',
				rendered: true,
				visible: false,
			},
			slots: {
				default: 'Hello',
			},
		})

		const el = wrapper.find('div')
		expect(el.exists()).toBe(true)
		expect(el.attributes('style') ?? '').toContain('display: none')
	})
})
