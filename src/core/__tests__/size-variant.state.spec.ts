import { describe, it, expect, vi } from 'vitest'
import { TSizeState, TVariantState } from '../base/states'

describe('TSizeState', () => {
	it('возвращает пустой массив для значений из exclude', () => {
		const s = new TSizeState({ baseClass: 's-test', value: 'normal', exclude: ['normal'] })
		expect(s.getClass()).toEqual([])
	})

	it('возвращает CSS-класс для значений не из exclude', () => {
		const s = new TSizeState({ baseClass: 's-test', value: 'xl', exclude: ['normal'] })
		expect(s.getClass()).toEqual(['s-test--size-xl'])
	})

	it('эмитит change при изменении value', () => {
		const s = new TSizeState({ baseClass: 's-test', value: 'normal', exclude: ['normal'] })
		const handler = vi.fn()
		s.events.on('change', handler)

		s.value = 'xl'
		expect(handler).toHaveBeenCalledWith('xl')
		expect(s.getClass()).toEqual(['s-test--size-xl'])
	})

	it('переключение с исключенного на неисключенное значение корректно меняет getClass', () => {
		const s = new TSizeState({ baseClass: 's-btn', value: 'normal', exclude: ['normal'] })
		expect(s.getClass()).toEqual([])

		s.value = 'xl'
		expect(s.getClass()).toEqual(['s-btn--size-xl'])
	})
})

describe('TVariantState', () => {
	it('возвращает пустой массив для значений из exclude', () => {
		const s = new TVariantState({ baseClass: 's-test', value: 'normal', exclude: ['normal'] })
		expect(s.getClass()).toEqual([])
	})

	it('возвращает CSS-класс для значений не из exclude', () => {
		const s = new TVariantState({ baseClass: 's-test', value: 'primary', exclude: ['normal'] })
		expect(s.getClass()).toEqual(['s-test--primary'])
	})

	it('эмитит change при изменении value', () => {
		const s = new TVariantState({ baseClass: 's-test', value: 'normal', exclude: ['normal'] })
		const handler = vi.fn()
		s.events.on('change', handler)

		s.value = 'primary'
		expect(handler).toHaveBeenCalledWith('primary')
		expect(s.getClass()).toEqual(['s-test--primary'])
	})

	it('переключение с исключенного на неисключенное значение корректно меняет getClass', () => {
		const s = new TVariantState({ baseClass: 's-btn', value: 'normal', exclude: ['normal'] })
		expect(s.getClass()).toEqual([])

		s.value = 'primary'
		expect(s.getClass()).toEqual(['s-btn--primary'])

		s.value = 'normal'
		expect(s.getClass()).toEqual([])

		s.value = 'danger'
		expect(s.getClass()).toEqual(['s-btn--danger'])
	})
})
