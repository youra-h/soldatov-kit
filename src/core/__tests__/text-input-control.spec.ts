import { describe, it, expect, vi } from 'vitest'
import { TInputControl } from '../base/input-control'
import type { ITextInputControlProps } from '../base/input-control'

describe('TInputControl', () => {
	it('принимает form-flags через { props } и через plain props', () => {
		const a = new TInputControl<ITextInputControlProps>({
			props: { value: '', readonly: true, required: true },
		} as any)
		expect(a.readonly).toBe(true)
		expect(a.required).toBe(true)
	})

	it('сеттерами эмитит change:* события', () => {
		const c = new TInputControl<ITextInputControlProps>({ value: '' } as any)
		const ro = vi.fn()
		const req = vi.fn()
		c.events.on('change:readonly', ro)
		c.events.on('change:required', req)

		c.readonly = true
		expect(ro).toHaveBeenCalledWith(true)
		c.required = true
		expect(req).toHaveBeenCalledWith(true)
	})

	it('getProps/toJSON отражают input flags', () => {
		const c = new TInputControl<ITextInputControlProps>({
			value: '',
			readonly: true,
			required: true,
		} as any)
		const props = c.getProps()
		expect(props).toMatchObject({ readonly: true, required: true })
		expect(c.toJSON()).toEqual(props)
	})

	it('value setter эмитит change:value и input:value', () => {
		const c = new TInputControl<ITextInputControlProps>({ value: 'a' } as any)
		const change = vi.fn()
		const input = vi.fn()
		c.events.on('change:value', change)
		c.events.on('input:value', input)

		c.value = 'b'
		expect(change).toHaveBeenCalledWith({ newValue: 'b', oldValue: 'a' })
		expect(input).toHaveBeenCalledWith({ newValue: 'b', oldValue: 'a' })
		expect(c.value).toBe('b')
	})
})
