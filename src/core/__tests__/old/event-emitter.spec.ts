import { describe, it, expect, vi } from 'vitest'
import { TEventEmitter } from '../../common/event-emitter'

describe('TEventEmitter', () => {
	it('on/emit: подписка и вызов события', () => {
		const emitter = new TEventEmitter()
		const handler = vi.fn()
		emitter.on('test', handler)
		emitter.emit('test', 1, 2)
		expect(handler).toHaveBeenCalledWith(1, 2)
	})

	it('off: отписка от события', () => {
		const emitter = new TEventEmitter()
		const handler = vi.fn()
		emitter.on('test', handler)
		emitter.off('test', handler)
		emitter.emit('test')
		expect(handler).not.toHaveBeenCalled()
	})

	it('emitWithResult: возвращает true если все обработчики true/undefined', () => {
		const emitter = new TEventEmitter()
		emitter.on('test', () => true)
		emitter.on('test', () => undefined)
		expect(emitter.emitWithResult('test')).toBe(true)
	})

	it('emitWithResult: возвращает false если хотя бы один обработчик false', () => {
		const emitter = new TEventEmitter()
		emitter.on('test', () => true)
		emitter.on('test', () => false)
		expect(emitter.emitWithResult('test')).toBe(false)
	})

	it('remove: удаляет все события', () => {
		const emitter = new TEventEmitter()
		const handler = vi.fn()
		emitter.on('test', handler)
		emitter.remove()
		emitter.emit('test')
		expect(handler).not.toHaveBeenCalled()
	})

	it('remove: удаляет только указанное событие', () => {
		const emitter = new TEventEmitter()
		const handler1 = vi.fn()
		const handler2 = vi.fn()
		emitter.on('test1', handler1)
		emitter.on('test2', handler2)
		emitter.remove('test1')
		emitter.emit('test1')
		emitter.emit('test2')
		expect(handler1).not.toHaveBeenCalled()
		expect(handler2).toHaveBeenCalled()
	})
})
