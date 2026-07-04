import { describe, it, expect, vi } from 'vitest'
import { TControl } from '../base/control'
import type { IControlProps } from '../base/control'

describe('TControl', () => {
	it('дисейбл/фокус трекают state и эмитят события', () => {
		const ctrl = new TControl<IControlProps>({
			props: { disabled: false, focused: false },
		})
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
		ctrl.variant = 'accent'
		const classes = ctrl.classes.toArray()

		expect(classes).toContain('s-component-view')
		expect(classes).toContain('s-component-view--size-xl')
		expect(classes).toContain('s-component-view--accent')
	})

	it('getProps возвращает variant/size/disabled/focused', () => {
		const ctrl = new TControl<IControlProps>({
			props: {
				size: 'sm',
				variant: 'accent',
				disabled: true,
				focused: false,
			},
		})
		expect(ctrl.getProps()).toMatchObject({
			variant: 'accent',
			size: 'sm',
			disabled: true,
			focused: false,
		})
	})

})
