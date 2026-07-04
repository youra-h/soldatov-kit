import { describe, it, expect, vi } from 'vitest'
import { TCheckBox } from '../components/check-box'

describe('TCheckBox', () => {
	it('создаётся через { props } и через plain props', () => {
		const a = new TCheckBox({ props: { value: true } })
		expect(a.value).toBe(true)
		expect(a.classes.toArray()).toContain('s-check-box')

		const b = new TCheckBox({ value: false })
		expect(b.value).toBe(false)

		const c = new TCheckBox({
			props: { value: true, size: 'xl', variant: 'accent', plain: true },
		})
		expect(c.classes.toArray()).toContain('s-check-box')
	})

	it('classes меняются от indeterminate/plain + variant/size', () => {
		const cb = new TCheckBox({ props: { variant: 'normal', size: 'normal' } })
		expect(cb.classes.toArray()).toContain('s-check-box')

		cb.variant = 'positive'
		expect(cb.classes.toArray()).toContain('s-check-box--positive')

		cb.size = 'xl'
		expect(cb.classes.toArray()).toContain('s-check-box--size-xl')

		cb.indeterminate = true
		expect(cb.classes.toArray()).toContain('s-check-box--indeterminate')

		cb.plain = true
		expect(cb.classes.toArray()).toContain('s-check-box--plain')
	})

	it('value: value setter эмитит change:value', () => {
		const cb = new TCheckBox({ value: false })
		const changeValue = vi.fn()

		cb.events.on('change:value' as any, changeValue)

		cb.value = true
		expect(changeValue).toHaveBeenCalledWith({ newValue: true, oldValue: false })
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
