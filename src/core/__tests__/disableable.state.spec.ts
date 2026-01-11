import { describe, it, expect, vi } from 'vitest'
import { TStateUnit } from '../base/state-unit'

describe('TStateUnit<boolean>', () => {
	it('инициализируется initial и эмитит change только при изменении', () => {
		const s = new TStateUnit(false)
		const handler = vi.fn()
		s.events.on('change', handler)

		expect(s.value).toBe(false)

		s.value = true
		expect(s.value).toBe(true)
		expect(handler).toHaveBeenCalledWith(true)

		handler.mockClear()
		s.value = true
		expect(handler).not.toHaveBeenCalled()
	})
})
