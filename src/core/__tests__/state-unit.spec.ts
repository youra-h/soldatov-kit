import { describe, it, expect, vi } from 'vitest'
import { TStateUnit } from '../common/state-unit'

describe('TStateUnit', () => {
	it('хранит value и эмитит change(value) при изменении', () => {
		const s = new TStateUnit({ initial: 1 })
		const handler = vi.fn()
		s.events.on('change', handler)

		s.value = 2
		expect(handler).toHaveBeenCalledWith({ newValue: 2, oldValue: 1 })

		handler.mockClear()
		s.value = 2
		expect(handler).not.toHaveBeenCalled()
	})

	it('resolver: трансформирует значение при чтении', () => {
		const s = new TStateUnit({
			initial: 5,
			resolver: (value) => value * 2,
		})

		expect(s.value).toBe(10)

		s.value = 7
		expect(s.value).toBe(14)
	})

	it('resolver: setResolver меняет резольвер в рантайме', () => {
		const s = new TStateUnit({ initial: 5 })

		expect(s.value).toBe(5)

		s.setResolver((value) => value * 2)
		expect(s.value).toBe(10)

		s.setResolver(undefined)
		expect(s.value).toBe(5)
	})

	it('resolver: получает текущее _value, может делать fallback', () => {
		const s = new TStateUnit<number | undefined>({
			initial: undefined,
			resolver: (value) => value ?? 42,
		})

		expect(s.value).toBe(42)

		s.value = 7
		expect(s.value).toBe(7)

		s.value = undefined
		expect(s.value).toBe(42)
	})

	it('resolver: событие change эмитится с сырым newValue (до резольвера)', () => {
		const s = new TStateUnit({
			initial: 1,
			resolver: (value) => value * 10,
		})
		const handler = vi.fn()
		s.events.on('change', handler)

		s.value = 2
		expect(s.value).toBe(20)
		expect(handler).toHaveBeenCalledWith({ newValue: 2, oldValue: 1 })
	})
})
