import { describe, it, expect, vi } from 'vitest'
import { TStateUnit } from '../base/state-unit'

describe('TStateUnit', () => {
	it('хранит value и эмитит change(value) при изменении', () => {
		const s = new TStateUnit(1)
		const handler = vi.fn()
		s.events.on('change', handler)

		s.value = 2
		expect(handler).toHaveBeenCalledWith(2)

		handler.mockClear()
		s.value = 2
		expect(handler).not.toHaveBeenCalled()
	})
})
