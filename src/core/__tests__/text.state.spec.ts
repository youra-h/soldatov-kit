import { describe, it, expect, vi } from 'vitest'
import { TStateUnit } from '../base/state-unit'

describe('TStateUnit<string>', () => {
	it('изменяет value и эмитит change только при изменении', () => {
		const s = new TStateUnit('a')
		const handler = vi.fn()
		s.events.on('change', handler)

		expect(s.value).toBe('a')

		s.value = 'b'
		expect(s.value).toBe('b')
		expect(handler).toHaveBeenCalledWith('b')

		handler.mockClear()
		s.value = 'b'
		expect(handler).not.toHaveBeenCalled()
	})
})
