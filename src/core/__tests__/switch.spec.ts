import { describe, it, expect, vi } from 'vitest'
import { TSwitch } from '../components/switch'

describe('TSwitch', () => {
	it('создаётся через { props } и через plain props', () => {
		const a = new TSwitch({ props: { value: true } })
		expect(a.value).toBe(true)
		expect(a.classes.toArray()).toContain('s-switch')

		const b = new TSwitch({ value: false })
		expect(b.value).toBe(false)

		const c = new TSwitch({
			props: { value: true, size: 'xl', variant: 'accent' },
		})
		expect(c.classes.toArray()).toContain('s-switch')
	})

	it('value: value setter эмитит change:value', () => {
		const sw = new TSwitch({ value: false })
		const changeValue = vi.fn()

		sw.events.on('change:value' as any, changeValue)

		sw.value = true
		expect(changeValue).toHaveBeenCalledWith({ newValue: true, oldValue: false })
	})

	it('change(event) переключает значение и эмитит change', () => {
		const sw = new TSwitch({ value: false })
		const spy = vi.fn()
		sw.events.on('change' as any, spy)

		const event = new Event('click')
		sw.change(event)
		expect(sw.value).toBe(true)
		expect(spy).toHaveBeenCalled()
		const payload = spy.mock.calls[0]![0]
		expect(payload).toMatchObject({ event, value: true })
	})
})
