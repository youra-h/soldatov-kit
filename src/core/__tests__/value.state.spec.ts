import { describe, it, expect, vi } from 'vitest'
import { TValueState } from '../base/states'

describe('TValueState', () => {
	it('setter value эмитит change только при изменении', () => {
		const s = new TValueState(1)
		const handler = vi.fn()
		s.events.on('change', handler)

		s.value = 2
		expect(s.value).toBe(2)
		expect(handler).toHaveBeenCalledWith(2)

		handler.mockClear()
		s.value = 2
		expect(handler).not.toHaveBeenCalled()
	})

	it('input эмитит input и обновляет value', () => {
		const s = new TValueState('a')
		const handler = vi.fn()
		s.events.on('input', handler)

		s.input('b')
		expect(s.value).toBe('b')
		expect(handler).toHaveBeenCalledWith('b')
	})
})
