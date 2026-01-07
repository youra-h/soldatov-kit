import { describe, it, expect, vi } from 'vitest'
import { TTextable } from '../base/textable'
import type { ITextableProps } from '../base/textable'

describe('TTextable', () => {
	it('принимает text через { props } и через plain props', () => {
		const a = new TTextable<ITextableProps>({ props: { text: 'A' } })
		expect(a.text).toBe('A')

		const b = new TTextable<ITextableProps>({ text: 'B' })
		expect(b.text).toBe('B')
	})

	it('text setter эмитит change:text', () => {
		const t = new TTextable<ITextableProps>({ text: 'x' })
		const handler = vi.fn()
		t.events.on('change:text', handler)

		t.text = 'y'
		expect(handler).toHaveBeenCalledWith('y')
		expect(t.text).toBe('y')
	})

	it('assign меняет text через сеттер', () => {
		const t = new TTextable<ITextableProps>({ text: 'x' })
		t.assign({ text: 'z' })
		expect(t.text).toBe('z')
	})

	it('getProps/toJSON возвращают text', () => {
		const t = new TTextable<ITextableProps>({ text: 'hi' })
		const props = t.getProps()
		expect(props.text).toBe('hi')
		expect(t.toJSON()).toEqual(props)
	})
})
