import { describe, it, expect, vi } from 'vitest'
import { TVisibilityState } from '../common/states'

describe('TVisibilityState', () => {
	it('show/hide меняют visible и эмитят change', () => {
		const s = new TVisibilityState({ initial: false })
		const handler = vi.fn()
		s.events.on('change', handler)

		expect(s.value).toBe(false)

		s.show()
		expect(s.value).toBe(true)
		expect(handler).toHaveBeenCalledWith({ newValue: true, oldValue: false })

		s.hide()
		expect(s.value).toBe(false)
		expect(handler).toHaveBeenCalledWith({ newValue: false, oldValue: true })
	})
})
