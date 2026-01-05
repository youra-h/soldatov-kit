import { describe, it, expect } from 'vitest'
import { TEntity } from '../base/entity/entity.class'

// Минимальный тест для базового класса TEntity

describe('TEntity', () => {
	it('Создаёт экземпляр и работает assign/getProps', () => {
		class TestObj extends TEntity<{ a?: number; b?: string }> {
			a?: number
			b?: string
			getProps() {
				return { a: this.a, b: this.b }
			}
		}

		const obj = new TestObj()
		expect(obj.getProps()).toEqual({ a: undefined, b: undefined })

		obj.assign({ a: 42, b: 'hello' })
		expect(obj.a).toBe(42)
		expect(obj.b).toBe('hello')
		expect(obj.getProps()).toEqual({ a: 42, b: 'hello' })
	})

	it('toJSON возвращает копию props', () => {
		class TestObj extends TEntity<{ a?: number; b?: string }> {
			a?: number
			b?: string
			getProps() {
				return { a: this.a, b: this.b }
			}
		}

		const obj = new TestObj()
		obj.assign({ a: 1, b: 'x' })
		const json = obj.toJSON()
		expect(json).toEqual({ a: 1, b: 'x' })
		// Проверяем, что это копия, а не ссылка
		json.a = 100
		expect(obj.a).toBe(1)
	})
})
