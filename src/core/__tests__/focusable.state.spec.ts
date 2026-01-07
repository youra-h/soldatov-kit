import { describe, it, expect, vi } from 'vitest'
import { TFocusableState } from '../base/states'

describe('TFocusableState', () => {
	it('инициализируется initial и эмитит change только при изменении', () => {
		const s = new TFocusableState(false)
		const handler = vi.fn()
		s.events.on('change', handler)

		expect(s.focused).toBe(false)

		s.focused = true
		expect(s.focused).toBe(true)
		expect(handler).toHaveBeenCalledWith(true)

		handler.mockClear()
		s.focused = true
		expect(handler).not.toHaveBeenCalled()
	})
})
