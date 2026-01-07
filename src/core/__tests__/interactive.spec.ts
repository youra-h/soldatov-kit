import { describe, it, expect, vi } from 'vitest'
import { TInteractive } from '../base/interactive'
import { TDisableableState } from '../base/states'

describe('TInteractive', () => {
	it('меняет disabled/focused и эмитит события', () => {
		const interactive = new TInteractive()
		const disabledHandler = vi.fn()
		const focusedHandler = vi.fn()
		interactive.events.on('change:disabled', disabledHandler)
		interactive.events.on('change:focused', focusedHandler)

		interactive.disabled = true
		expect(interactive.disabled).toBe(true)
		expect(disabledHandler).toHaveBeenCalledWith(true)

		interactive.focused = true
		expect(interactive.focused).toBe(true)
		expect(focusedHandler).toHaveBeenCalledWith(true)

		interactive.disabled = false
		interactive.focused = false
		expect(disabledHandler).toHaveBeenCalledTimes(2)
		expect(focusedHandler).toHaveBeenCalledTimes(2)
	})

	it('click эмитит событие click', () => {
		const interactive = new TInteractive()
		const handler = vi.fn()
		interactive.events.on('click', handler)

		const event = new Event('test')
		interactive.click(event)

		expect(handler).toHaveBeenCalledWith(event)
	})

	it('states позволяет передать инстанс или класс для disableable-state', () => {
		const log: string[] = []

		class TLoggedDisableableState extends TDisableableState {
			constructor(initial: boolean, private readonly _log: string[]) {
				super(initial)
			}

			override set disabled(value: boolean) {
				super.disabled = value
				if (value) this._log.push('disabled:true')
			}
		}

		// 1) instance
		const instance = new TLoggedDisableableState(false, log)
		const i1 = new TInteractive({ states: { disableable: instance } })
		i1.disabled = true
		expect(log).toContain('disabled:true')

		// 2) ctor
		log.length = 0
		class CtorLogged extends TLoggedDisableableState {
			constructor(initial = false) {
				super(initial, log)
			}
		}
		const i2 = new TInteractive({ states: { disableable: CtorLogged } })
		i2.disabled = true
		expect(log).toContain('disabled:true')
	})
})
