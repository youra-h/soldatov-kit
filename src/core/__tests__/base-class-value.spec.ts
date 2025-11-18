import { describe, it, expect, vi } from 'vitest'
import { TBaseClassValue, type IBaseClassValueOptions } from '../common/base-class-value'

// Вспомогательный класс для тестирования абстрактного TBaseClassValue
class TestClass extends TBaseClassValue<string> {
	getClass(): string[] {
		return [this.baseClass + '--' + this.value]
	}
}

describe('TBaseClassValue', () => {
	it('по умолчанию value = normal, baseClass = s-control', () => {
		const inst = new TestClass()
		expect(inst.value).toBe('normal')
		expect(inst.baseClass).toBe('s-control')
	})

	it('устанавливает value и baseClass через options', () => {
		const inst = new TestClass({ value: 'custom', baseClass: 'my-class' })
		expect(inst.value).toBe('custom')
		expect(inst.baseClass).toBe('my-class')
	})

	it('getClass возвращает корректный класс', () => {
		const inst = new TestClass({ value: 'x', baseClass: 'b' })
		expect(inst.getClass()).toEqual(['b--x'])
	})

	it('событие change вызывается при изменении value', () => {
		const inst = new TestClass({ value: 'a' })
		const handler = vi.fn()
		inst.events.on('change', handler)
		inst.value = 'b'
		expect(handler).toHaveBeenCalledWith('b', 'a')
	})

	it('событие change не вызывается если value не меняется', () => {
		const inst = new TestClass({ value: 'a' })
		const handler = vi.fn()
		inst.events.on('change', handler)
		inst.value = 'a'
		expect(handler).not.toHaveBeenCalled()
	})
})
