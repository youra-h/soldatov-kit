import { describe, it, expect, vi } from 'vitest'
import { TControl } from '../base/control'
import type { IControlProps } from '../base/control'

describe('TControl', () => {
	it('дисейбл/фокус трекают state и эмитят события', () => {
		const ctrl = new TControl<IControlProps>({ baseClass: 's-test', disabled: false, focused: false })
		const disabledHandler = vi.fn()
		const focusedHandler = vi.fn()
		ctrl.events.on('change:disabled', disabledHandler)
		ctrl.events.on('change:focused', focusedHandler)

		ctrl.disabled = true
		expect(ctrl.disabled).toBe(true)
		expect(disabledHandler).toHaveBeenCalledWith(true)

		ctrl.focused = true
		expect(ctrl.focused).toBe(true)
		expect(focusedHandler).toHaveBeenCalledWith(true)
	})

	it('classes включает baseClass + state-модификаторы', () => {
		const ctrl = new TControl<IControlProps>({ size: 'normal', variant: 'normal' })
		ctrl.size = 'xl'
		ctrl.variant = 'primary'
		const classes = ctrl.classes

		expect(classes).toContain('s-presentable')
		expect(classes).toContain('s-presentable--size-xl')
		expect(classes).toContain('s-presentable--primary')
	})

	it('getProps возвращает variant/size/disabled/focused', () => {
		const ctrl = new TControl<IControlProps>({
			baseClass: 's-test',
			size: 'sm',
			variant: 'primary',
			disabled: true,
			focused: false,
		})
		expect(ctrl.getProps()).toMatchObject({
			variant: 'primary',
			size: 'sm',
			disabled: true,
			focused: false,
		})
	})

	it('click эмитит событие', () => {
		const ctrl = new TControl()
		const handler = vi.fn()
		ctrl.events.on('click', handler)
		const event = new Event('click')
		ctrl.click(event)
		expect(handler).toHaveBeenCalledWith(event)
	})
})
