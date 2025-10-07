import type { TObjectProps } from './types'

export abstract class TObject {
	getProps(): TObjectProps {
		return {}
	}

	assign(props: Partial<TObjectProps>): void {
		const keys = Object.keys(this.getProps()) as (keyof TObjectProps)[]

		for (const key of keys) {
			if (props[key] !== undefined) {
				// @ts-expect-error: динамическое присваивание через сеттеры
				this[key] = props[key]
			}
		}
	}
}
