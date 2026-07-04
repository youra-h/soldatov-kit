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

})
