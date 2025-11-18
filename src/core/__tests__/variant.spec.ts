import { describe, it, expect, vi } from 'vitest'
import { TVariant } from '../common/variant'
import type { TComponentVariant } from '../common/types'

describe('TVariant', () => {
	it('по умолчанию value = normal, baseClass = s-control', () => {
		const variant = new TVariant()
		expect(variant.value).toBe('normal')
		expect(variant.baseClass).toBe('s-control')
	})

	it('устанавливает value и baseClass через options', () => {
		const variant = new TVariant({ value: 'primary', baseClass: 'my-btn' })
		expect(variant.value).toBe('primary')
		expect(variant.baseClass).toBe('my-btn')
	})

	it('getClass возвращает корректный класс', () => {
		const variant = new TVariant({ value: 'danger', baseClass: 'my-btn' })
		expect(variant.getClass()).toEqual(['my-btn--danger'])
	})

	it('getClass возвращает [] если value в exclude', () => {
		const variant = new TVariant({ value: 'warning', exclude: ['warning'] })
		expect(variant.getClass()).toEqual([])
	})

	it('событие change вызывается при изменении value', () => {
		const variant = new TVariant({ value: 'normal' })
		const handler = vi.fn()
		variant.events.on('change', handler)
		variant.value = 'success'
		expect(handler).toHaveBeenCalledWith('success', 'normal')
	})

	it('событие change не вызывается если value не меняется', () => {
		const variant = new TVariant({ value: 'primary' })
		const handler = vi.fn()
		variant.events.on('change', handler)
		variant.value = 'primary'
		expect(handler).not.toHaveBeenCalled()
	})
})
