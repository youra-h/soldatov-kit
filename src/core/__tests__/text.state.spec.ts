import { describe, it, expect, vi } from 'vitest'
import { TTextState } from '../base/states'

describe('TTextState', () => {
	it('изменяет text и эмитит change только при изменении', () => {
		const s = new TTextState('a')
		const handler = vi.fn()
		s.events.on('change', handler)

		expect(s.text).toBe('a')

		s.text = 'b'
		expect(s.text).toBe('b')
		expect(handler).toHaveBeenCalledWith('b')

		handler.mockClear()
		s.text = 'b'
		expect(handler).not.toHaveBeenCalled()
	})
})
