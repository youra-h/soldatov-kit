import { describe, it, expect, vi } from 'vitest'
import { TSizeState, TVariantState } from '../base/states'

describe('TSizeState', () => {
	it('строит класс size и уважает exclude', () => {
		const s = new TSizeState({ baseClass: 's-test', value: 'normal', exclude: ['normal'] })
		expect(s.getClass()).toEqual([])

		const handler = vi.fn()
		s.events.on('change', handler)
		s.value = 'xl'
		expect(handler).toHaveBeenCalledWith('xl', 'normal')
		expect(s.getClass()).toEqual(['s-test--size-xl'])
	})
})

describe('TVariantState', () => {
	it('строит класс variant и уважает exclude', () => {
		const s = new TVariantState({ baseClass: 's-test', value: 'normal', exclude: ['normal'] })
		expect(s.getClass()).toEqual([])

		const handler = vi.fn()
		s.events.on('change', handler)
		s.value = 'primary'
		expect(handler).toHaveBeenCalledWith('primary', 'normal')
		expect(s.getClass()).toEqual(['s-test--primary'])
	})
})
