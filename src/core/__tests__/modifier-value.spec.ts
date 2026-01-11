import { describe, it, expect, vi } from 'vitest'
import { TStylableModifierState } from '../base/states'

type TMode = 'normal' | 'x'

class TModeState extends TStylableModifierState<TMode> {
	getClass(): string[] {
		return this.value && !this._exclude.includes(this.value) ? [`${this._baseClass}--${this.value}`] : []
	}
}

describe('TStylableModifierState', () => {
	it('эмитит change и поддерживает exclude', () => {
		const s = new TModeState({ baseClass: 's-test', exclude: ['normal'], value: 'normal' })
		const handler = vi.fn()
		s.events.on('change', handler)

		expect(s.getClass()).toEqual([])

		s.value = 'x'
		expect(handler).toHaveBeenCalledWith('x')
		expect(s.getClass()).toEqual(['s-test--x'])
	})

	it('baseClass setter влияет на getClass()', () => {
		const s = new TModeState({ baseClass: 'a', value: 'x' })
		expect(s.getClass()).toEqual(['a--x'])
		s.baseClass = 'b'
		expect(s.getClass()).toEqual(['b--x'])
	})
})
