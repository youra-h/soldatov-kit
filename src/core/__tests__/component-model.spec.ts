import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TComponent } from '../base/component'
import type { IComponentProps } from '../base/component'

describe('TComponent', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('принимает props в формате { props }', () => {
		const m = new TComponent<IComponentProps>({ props: { id: 'x' } })
		expect(m.id).toBe('x')
	})

	it('принимает "голые" props без ключа props', () => {
		const m = new TComponent<IComponentProps>({ id: 123 })
		expect(m.id).toBe(123)
	})

	it('create создаёт инстанс с переданными props', () => {
		const m = TComponent.create({ id: 'created' })
		expect(m).toBeInstanceOf(TComponent)
		expect(m.id).toBe('created')
	})

	it('getProps возвращает актуальные свойства', () => {
		const m = new TComponent<IComponentProps>({ id: 'a' })
		expect(m.getProps()).toMatchObject({ id: 'a' })
		m.id = 'b'
		expect(m.getProps()).toMatchObject({ id: 'b' })
	})

	it('assign использует сеттеры и меняет состояние', () => {
		const m = new TComponent<IComponentProps>({ id: 'a' })
		m.assign({ id: 'b' })
		expect(m.id).toBe('b')
	})

	it('toJSON сериализует getProps()', () => {
		const m = new TComponent<IComponentProps>({ id: 'x' })
		expect(m.toJSON()).toMatchObject({ id: 'x' })
	})

	it('эмитит created асинхронно после конструктора', () => {
		const m = new TComponent<IComponentProps>({ id: 'x' })
		const handler = vi.fn()
		m.events.on('created', handler)

		vi.runAllTimers()
		expect(handler).toHaveBeenCalledTimes(1)
		expect(handler.mock.calls[0]?.[0]).toBe(m)
	})
})
