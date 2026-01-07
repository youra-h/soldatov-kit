import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TComponentModel } from '../base/component-model'
import type { IComponentModelProps } from '../base/component-model'

describe('TComponentModel', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('принимает props в формате { props }', () => {
		const m = new TComponentModel<IComponentModelProps>({ props: { id: 'x' } })
		expect(m.id).toBe('x')
	})

	it('принимает "голые" props без ключа props', () => {
		const m = new TComponentModel<IComponentModelProps>({ id: 123 })
		expect(m.id).toBe(123)
	})

	it('create создаёт инстанс с переданными props', () => {
		const m = TComponentModel.create({ id: 'created' })
		expect(m).toBeInstanceOf(TComponentModel)
		expect(m.id).toBe('created')
	})

	it('getProps возвращает актуальные свойства', () => {
		const m = new TComponentModel<IComponentModelProps>({ id: 'a' })
		expect(m.getProps()).toEqual({ id: 'a' })
		m.id = 'b'
		expect(m.getProps()).toEqual({ id: 'b' })
	})

	it('assign использует сеттеры и меняет состояние', () => {
		const m = new TComponentModel<IComponentModelProps>({ id: 'a' })
		m.assign({ id: 'b' })
		expect(m.id).toBe('b')
	})

	it('toJSON сериализует getProps()', () => {
		const m = new TComponentModel<IComponentModelProps>({ id: 'x' })
		expect(m.toJSON()).toEqual({ id: 'x' })
	})

	it('эмитит created асинхронно после конструктора', () => {
		const m = new TComponentModel<IComponentModelProps>({ id: 'x' })
		const handler = vi.fn()
		m.events.on('created', handler)

		vi.runAllTimers()
		expect(handler).toHaveBeenCalledTimes(1)
		expect(handler.mock.calls[0]?.[0]).toBe(m)
	})
})
