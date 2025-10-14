import { describe, it, expect } from 'vitest'
import { TObject } from '../classes/object/object.class'

// Минимальный тест для базового класса TObject

describe('TObject', () => {
	it('создаёт экземпляр и работает assign/getProps', () => {
		class TestObj extends TObject {
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
})
