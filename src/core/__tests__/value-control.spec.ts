import { describe, it, expect, vi } from 'vitest'
import { TValueControl } from '../base/value-control'
import type { IValueControlProps } from '../base/value-control'

describe('TValueControl', () => {
	it('принимает value/name через { props } и через plain props', () => {
		type P = IValueControlProps<string>

		const a = new TValueControl<string, P>({ props: { value: 'A', name: 'n1' } } as any)
		expect(a.value).toBe('A')
		expect(a.name).toBe('n1')

		const b = new TValueControl<string, P>({ value: 'B', name: 'n2' } as any)
		expect(b.value).toBe('B')
		expect(b.name).toBe('n2')
	})

	it('value setter эмитит change:value, input() эмитит input:value', () => {
		type P = IValueControlProps<string>
		const c = new TValueControl<string, P>({ value: 'x', name: 'n' } as any)
		const changeHandler = vi.fn()
		const inputHandler = vi.fn()
		c.events.on('change:value', changeHandler)
		c.events.on('input:value', inputHandler)

		c.value = 'y'
		expect(changeHandler).toHaveBeenCalledWith('y')
		expect(c.value).toBe('y')

		c.input('z')
		expect(inputHandler).toHaveBeenCalledWith('z')
		expect(c.value).toBe('z')
	})

	it('name setter эмитит change:name', () => {
		type P = IValueControlProps<string>
		const c = new TValueControl<string, P>({ value: 'x', name: 'a' } as any)
		const handler = vi.fn()
		c.events.on('change:name', handler)

		c.name = 'b'
		expect(handler).toHaveBeenCalledWith('b')
		expect(c.name).toBe('b')
	})

	it('assign меняет value и name', () => {
		type P = IValueControlProps<string>
		const c = new TValueControl<string, P>({ value: 'x', name: 'a' } as any)
		c.assign({ value: 'y', name: 'b' } as any)
		expect(c.value).toBe('y')
		expect(c.name).toBe('b')
	})

	it('getProps/toJSON отражают value и name', () => {
		type P = IValueControlProps<string>
		const c = new TValueControl<string, P>({ value: 'x', name: 'a' } as any)
		const props = c.getProps()
		expect(props).toMatchObject({ value: 'x', name: 'a' })
		expect(c.toJSON()).toEqual(props)
	})
})
