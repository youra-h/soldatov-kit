import { describe, it, expect, vi } from 'vitest'
import { TModifierValue } from '../base/states'

type TMode = 'normal' | 'x'

class TModeState extends TModifierValue<TMode> {
	getClass(): string[] {
		return this.value && !this._exclude.includes(this.value) ? [`${this._baseClass}--${this.value}`] : []
	}
}

describe('TModifierValue', () => {
	it('эмитит change(new, old) и поддерживает exclude', () => {
		const s = new TModeState({ baseClass: 's-test', exclude: ['normal'], value: 'normal' })
		const handler = vi.fn()
		s.events.on('change', handler)

		expect(s.getClass()).toEqual([])

		s.value = 'x'
		expect(handler).toHaveBeenCalledWith('x', 'normal')
		expect(s.getClass()).toEqual(['s-test--x'])
	})

	it('baseClass setter влияет на getClass()', () => {
		const s = new TModeState({ baseClass: 'a', value: 'x' })
		expect(s.getClass()).toEqual(['a--x'])
		s.baseClass = 'b'
		expect(s.getClass()).toEqual(['b--x'])
	})
})
