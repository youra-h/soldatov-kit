import { describe, it, expect, vi } from 'vitest'
import { TInputState } from '../base/states'

describe('TInputState', () => {
	it('по умолчанию имеет нормальные значения', () => {
		const s = new TInputState()
		expect(s.readonly).toBe(false)
		expect(s.required).toBe(false)
		expect(s.invalid).toBe(false)
		expect(s.state).toBe('normal')
		expect(s.loading).toBe(false)
	})

	it('сеттерами эмитит change с патчем', () => {
		const s = new TInputState()
		const handler = vi.fn()
		s.events.on('change', handler)

		s.readonly = true
		expect(handler).toHaveBeenLastCalledWith({ readonly: true })

		s.required = true
		expect(handler).toHaveBeenLastCalledWith({ required: true })

		s.loading = true
		expect(handler).toHaveBeenLastCalledWith({ loading: true })
	})

	it('invalid=true принудительно выставляет state=error и эмитит патч invalid+state', () => {
		const s = new TInputState({ state: 'normal', invalid: false })
		const handler = vi.fn()
		s.events.on('change', handler)

		s.invalid = true
		expect(s.invalid).toBe(true)
		expect(s.state).toBe('error')
		expect(handler).toHaveBeenLastCalledWith({ invalid: true, state: 'error' })
	})

	it('при инициализации invalid=true принудительно выставляет state=error', () => {
		const s = new TInputState({ invalid: true, state: 'normal' })
		expect(s.invalid).toBe(true)
		expect(s.state).toBe('error')
	})
})
