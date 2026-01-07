import { describe, it, expect } from 'vitest'
import { TEntity } from '../base/entity'

type TTestProps = {
	a?: number
	b?: string
}

class TTestEntity extends TEntity<TTestProps> {
	protected _a?: number
	protected _b?: string

	get a(): number | undefined {
		return this._a
	}
	set a(value: number | undefined) {
		this._a = value
	}

	get b(): string | undefined {
		return this._b
	}
	set b(value: string | undefined) {
		this._b = value
	}

	getProps(): Readonly<TTestProps> {
		return {
			a: this._a,
			b: this._b,
		}
	}
}

describe('TEntity', () => {
	it('assign присваивает только ключи из getProps()', () => {
		const e = new TTestEntity()
		e.assign({ a: 1 })
		expect(e.a).toBe(1)

		// undefined не должен затирать текущее значение
		e.assign({ a: undefined })
		expect(e.a).toBe(1)

		e.assign({ b: 'x' })
		expect(e.b).toBe('x')
	})

	it('toJSON возвращает копию getProps()', () => {
		const e = new TTestEntity()
		e.assign({ a: 10, b: 'hi' })
		const json = e.toJSON()

		expect(json).toEqual({ a: 10, b: 'hi' })
		// копия
		expect(json).not.toBe(e.getProps())
	})
})
