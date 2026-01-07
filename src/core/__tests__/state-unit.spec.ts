import { describe, it, expect, vi } from 'vitest'
import { TStateUnit } from '../base/state-unit'

describe('TStateUnit', () => {
	it('имеет events и умеет эмитить события', () => {
		type TEvents = { ping: (value: number) => void }
		class TTestState extends TStateUnit<TEvents> {}

		const s = new TTestState()
		const handler = vi.fn()
		s.events.on('ping', handler)
		s.events.emit('ping', 123)

		expect(handler).toHaveBeenCalledWith(123)
	})
})
