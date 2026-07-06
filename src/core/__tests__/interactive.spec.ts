import { describe, it, expect, vi } from 'vitest'
import { TInteractive } from '../base/interactive'
import { TStateUnit } from '../common/state-unit'

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

	it('states позволяет передать инстанс или класс для disableState-state', () => {
		const log: string[] = []

		class TLoggedDisableableState extends TStateUnit<boolean> {
			constructor(initial: boolean, private readonly _log: string[]) {
				super(initial)
			}

			override set value(value: boolean) {
				super.value = value
				if (value) this._log.push('disabled:true')
			}
		}

		// 1) instance
		const instance = new TLoggedDisableableState(false, log)
		const i1 = new TInteractive({ states: { disabled: instance } })
		i1.disabled = true
		expect(log).toContain('disabled:true')

	})
})
