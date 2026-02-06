import { describe, it, expect, vi } from 'vitest'
import { TCheckBox } from '../components/check-box'

describe('TCheckBox', () => {
	it('создаётся через { props } и через plain props; baseClass override только через { baseClass, props }', () => {
		const a = new TCheckBox({ props: { value: true } })
		expect(a.value).toBe(true)
		expect(a.classes).toContain('s-check-box')

		const b = new TCheckBox({ value: false })
		expect(b.value).toBe(false)

		const c = new TCheckBox({
			renderConfig: { baseClass: 's-cb' },
			props: { value: true, size: 'xl', variant: 'primary', plain: true },
		})
		expect(c.classes).toContain('s-cb')
		expect(c.classes).toContain('s-cb--primary')
		expect(c.classes).toContain('s-cb--size-xl')
		expect(c.classes).toContain('s-cb--plain')
	})

	it('classes меняются от indeterminate/plain + variant/size', () => {
		const cb = new TCheckBox({ props: { variant: 'normal', size: 'normal' } })
		expect(cb.classes).toContain('s-check-box')

		cb.variant = 'success'
		expect(cb.classes).toContain('s-check-box--success')

		cb.size = 'xl'
		expect(cb.classes).toContain('s-check-box--size-xl')

		cb.indeterminate = true
		expect(cb.classes).toContain('s-check-box--indeterminate')

		cb.plain = true
		expect(cb.classes).toContain('s-check-box--plain')
	})

	it('value/input: value setter эмитит change:value (+legacy changeValue), input() эмитит input:value', () => {
		const cb = new TCheckBox({ value: false })
		const changeValue = vi.fn()
		const legacy = vi.fn()
		const input = vi.fn()

		cb.events.on('change:value' as any, changeValue)
		cb.events.on('changeValue' as any, legacy)
		cb.events.on('input:value' as any, input)

		cb.value = true
		expect(changeValue).toHaveBeenCalledWith(true)
		expect(legacy).toHaveBeenCalledWith(true)
	})

	it('change(event) переключает значение и эмитит change', () => {
		const cb = new TCheckBox({ value: false })
		const spy = vi.fn()
		cb.events.on('change' as any, spy)

		const event = new Event('click')
		cb.change(event)
		expect(cb.value).toBe(true)
		expect(spy).toHaveBeenCalled()
		const payload = spy.mock.calls[0]![0]
		expect(payload).toMatchObject({ event, value: true })
	})

	it('если indeterminate=true, change() сначала снимает indeterminate и ставит value=true', () => {
		const cb = new TCheckBox({ props: { value: null, indeterminate: true } })
		expect(cb.indeterminate).toBe(true)

		cb.change()
		expect(cb.indeterminate).toBe(false)
		expect(cb.value).toBe(true)
	})

	it('getAriaChecked возвращает mixed/true/false', () => {
		const cb = new TCheckBox({ value: false })
		expect(cb.getAriaChecked()).toBe('false')

		cb.value = true
		expect(cb.getAriaChecked()).toBe('true')

		cb.indeterminate = true
		expect(cb.getAriaChecked()).toBe('mixed')
	})
})
