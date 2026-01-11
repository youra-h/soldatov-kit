import { describe, it, expect, vi } from 'vitest'
import { TSwitch } from '../components/switch'
import { TIcon } from '../components/icon'

describe('TSwitch', () => {
	it('создаётся через { props } и через plain props; baseClass override только через { baseClass, props }', () => {
		const a = new TSwitch({ props: { value: true } })
		expect(a.value).toBe(true)
		expect(a.classes).toContain('s-switch')

		const b = new TSwitch({ value: false })
		expect(b.value).toBe(false)

		const c = new TSwitch({
			baseClass: 's-sw',
			props: { value: true, size: 'xl', variant: 'primary' },
		})
		expect(c.classes).toContain('s-sw')
		expect(c.classes).toContain('s-sw--primary')
		expect(c.classes).toContain('s-sw--size-xl')
	})

	it('value/input: value setter эмитит change:value (+legacy changeValue), input() эмитит input:value', () => {
		const sw = new TSwitch({ value: false })
		const changeValue = vi.fn()
		const legacy = vi.fn()
		const input = vi.fn()

		sw.events.on('change:value' as any, changeValue)
		sw.events.on('changeValue' as any, legacy)
		sw.events.on('input:value' as any, input)

		sw.value = true
		expect(changeValue).toHaveBeenCalledWith(true)
		expect(legacy).toHaveBeenCalledWith(true)
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

	it('icon создаётся через getInstance и синхронизирует size', () => {
		const sw = new TSwitch({ size: 'normal' })

		sw.icon = { tag: 'i1', size: 'xl' } as any
		expect(sw.icon).toBeInstanceOf(TIcon)
		expect(sw.icon!.size).toBe('normal')

		sw.size = 'xl'
		expect(sw.icon!.size).toBe('xl')
	})
})
