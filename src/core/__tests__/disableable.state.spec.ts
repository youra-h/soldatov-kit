import { describe, it, expect, vi } from 'vitest'
import { TDisableableState } from '../base/states'

describe('TDisableableState', () => {
	it('инициализируется initial и эмитит change только при изменении', () => {
		const s = new TDisableableState(false)
		const handler = vi.fn()
		s.events.on('change', handler)

		expect(s.disabled).toBe(false)

		s.disabled = true
		expect(s.disabled).toBe(true)
		expect(handler).toHaveBeenCalledWith(true)

		handler.mockClear()
		s.disabled = true
		expect(handler).not.toHaveBeenCalled()
	})
})
