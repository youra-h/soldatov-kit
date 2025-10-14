import { describe, it, expect, vi } from 'vitest'
import { TSize } from '../common/size'

describe('TSize', () => {
	it('по умолчанию value = normal, baseClass = s-control', () => {
		const size = new TSize()
		expect(size.value).toBe('normal')
		expect(size.baseClass).toBe('s-control')
	})

	it('устанавливает value и baseClass через options', () => {
		const size = new TSize({ value: 'lg', baseClass: 'my-btn' })
		expect(size.value).toBe('lg')
		expect(size.baseClass).toBe('my-btn')
	})

	it('getClass возвращает корректный класс', () => {
		const size = new TSize({ value: 'sm', baseClass: 'my-btn' })
		expect(size.getClass()).toEqual(['my-btn--size-sm'])
	})

	it('getClass возвращает [] если value в exclude', () => {
		const size = new TSize({ value: 'sm', exclude: ['sm'] })
		expect(size.getClass()).toEqual([])
	})

	it('событие change вызывается при изменении value', () => {
		const size = new TSize({ value: 'sm' })
		const handler = vi.fn()
		size.on('change', handler)
		size.value = 'lg'
		expect(handler).toHaveBeenCalledWith('lg', 'sm')
	})

	it('событие change не вызывается если value не меняется', () => {
		const size = new TSize({ value: 'sm' })
		const handler = vi.fn()
		size.on('change', handler)
		size.value = 'sm'
		expect(handler).not.toHaveBeenCalled()
	})
})
