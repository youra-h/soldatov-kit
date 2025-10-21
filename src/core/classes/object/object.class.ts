import type { TObjectProps, IObject } from './types'

export abstract class TObject implements IObject {
	getProps(): TObjectProps {
		return {}
	}

	assign(source: Partial<TObjectProps>): void {
		const keys = Object.keys(this.getProps()) as (keyof TObjectProps)[]

		for (const key of keys) {
			if (source[key] !== undefined) {
				// @ts-expect-error: динамическое присваивание через сеттеры
				this[key] = source[key]
			}
		}
	}
}
