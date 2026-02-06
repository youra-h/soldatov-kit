import { describe, it, expect, vi } from 'vitest'
import { TInputControl } from '../base/input-control'
import type { ITextInputControlProps } from '../base/input-control'

describe('TInputControl', () => {
	it('принимает form-flags через { props } и через plain props', () => {
		const a = new TInputControl<ITextInputControlProps>({
			props: { value: '', readonly: true, required: true, invalid: false, state: 'warning' },
		} as any)
		expect(a.readonly).toBe(true)
		expect(a.required).toBe(true)
		expect(a.invalid).toBe(false)
		expect(a.state).toBe('warning')

		const b = new TInputControl<ITextInputControlProps>({
			value: '', readonly: false, required: false, invalid: true, state: 'normal',
		} as any)
		expect(b.invalid).toBe(true)
		// Инвариант: invalid=true -> state='error'
		expect(b.state).toBe('error')
	})

	it('сеттерами эмитит change:* события', () => {
		const c = new TInputControl<ITextInputControlProps>({ value: '' } as any)
		const ro = vi.fn()
		const req = vi.fn()
		const inv = vi.fn()
		const st = vi.fn()
		c.events.on('change:readonly', ro)
		c.events.on('change:required', req)
		c.events.on('change:invalid', inv)
		c.events.on('change:state', st)

		c.readonly = true
		expect(ro).toHaveBeenCalledWith(true)
		c.required = true
		expect(req).toHaveBeenCalledWith(true)

		c.state = 'success'
		expect(st).toHaveBeenCalledWith('success')

		c.invalid = true
		expect(inv).toHaveBeenCalledWith(true)
		// Автоматически устанавливается state='error' при invalid=true
		expect(st).toHaveBeenCalledWith('error')
		expect(c.state).toBe('error')
	})

	it('getProps/toJSON отражают input flags', () => {
		const c = new TInputControl<ITextInputControlProps>({ value: '', readonly: true, required: true } as any)
		const props = c.getProps()
		expect(props).toMatchObject({ readonly: true, required: true })
		expect(c.toJSON()).toEqual(props)
	})

	it('наследует value и события change:value/input:value', () => {
		const c = new TInputControl<ITextInputControlProps>({ value: 'a' } as any)
		const change = vi.fn()
		const input = vi.fn()
		c.events.on('change:value', change)
		c.events.on('input:value', input)
	})
})
