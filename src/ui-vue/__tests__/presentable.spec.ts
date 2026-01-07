import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { TPresentable } from '@core'

import Presentable from '../components/presentable/Presentable.vue'

describe('ui-vue: Presentable', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

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

	it('поддерживает :is="instance" и пробрасывает события (instance.events.on + Vue @event)', async () => {
		const instance = new TPresentable({ tag: 'div', rendered: true, visible: true })

		const onCreated = vi.fn()
		const onBeforeShow = vi.fn()
		const onAfterShow = vi.fn()
		const onBeforeHide = vi.fn()
		const onAfterHide = vi.fn()
		const onShow = vi.fn()
		const onHide = vi.fn()
		const onChangeVisible = vi.fn()
		const onChangeRendered = vi.fn()

		const instCreated = vi.fn()
		const instBeforeShow = vi.fn(() => true)
		const instAfterShow = vi.fn()
		const instBeforeHide = vi.fn(() => true)
		const instAfterHide = vi.fn()
		const instShow = vi.fn()
		const instHide = vi.fn()
		const instChangeVisible = vi.fn()
		const instChangeRendered = vi.fn()

		instance.events.on('created' as any, instCreated)
		instance.events.on('beforeShow' as any, instBeforeShow)
		instance.events.on('afterShow' as any, instAfterShow)
		instance.events.on('beforeHide' as any, instBeforeHide)
		instance.events.on('afterHide' as any, instAfterHide)
		instance.events.on('show' as any, instShow)
		instance.events.on('hide' as any, instHide)
		instance.events.on('change:visible' as any, instChangeVisible)
		instance.events.on('change:rendered' as any, instChangeRendered)

		const wrapper = mount(Presentable as any, {
			props: {
				is: instance,
				// Vue listeners (эквивалент @event="handler")
				onCreated,
				onBeforeShow,
				onAfterShow,
				onBeforeHide,
				onAfterHide,
				onShow,
				onHide,
				['onChange:visible']: onChangeVisible,
				['onChange:rendered']: onChangeRendered,
			} as any,
			slots: {
				default: 'Hello',
			},
		})

		// created (core событие уходит через setTimeout)
		await vi.runAllTimersAsync()
		expect(instCreated).toHaveBeenCalled()
		expect(onCreated).toHaveBeenCalled()

		instance.rendered = false
		expect(instChangeRendered).toHaveBeenCalledWith(false)
		expect(onChangeRendered).toHaveBeenCalledWith(false)

		// show/hide (+ before/after и change:visible)
		instance.hide()
		expect(instBeforeHide).toHaveBeenCalled()
		expect(instHide).toHaveBeenCalled()
		expect(instAfterHide).toHaveBeenCalled()
		expect(instChangeVisible).toHaveBeenCalledWith(false)
		expect(onBeforeHide).toHaveBeenCalled()
		expect(onHide).toHaveBeenCalled()
		expect(onAfterHide).toHaveBeenCalled()
		expect(onChangeVisible).toHaveBeenCalledWith(false)

		instance.show()
		expect(instBeforeShow).toHaveBeenCalled()
		expect(instShow).toHaveBeenCalled()
		expect(instAfterShow).toHaveBeenCalled()
		expect(instChangeVisible).toHaveBeenCalledWith(true)
		expect(onBeforeShow).toHaveBeenCalled()
		expect(onShow).toHaveBeenCalled()
		expect(onAfterShow).toHaveBeenCalled()
		expect(onChangeVisible).toHaveBeenCalledWith(true)

		// sanity: Vue компонент реально использует instance
		expect(wrapper.text()).toContain('Hello')
	})
})
