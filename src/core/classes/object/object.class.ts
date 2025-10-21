import type { TObjectProps, IObject } from './types'

export abstract class TObject<TProps extends TObjectProps = TObjectProps> implements IObject<TProps> {
	getProps(): TProps {
		return {} as TProps
	}

	assign(source: Partial<TProps>): void {
		if (!source) return
		const keys = Object.keys(this.getProps()) as (keyof TProps)[]
		for (const key of keys) {
			if (source[key] !== undefined) {
				// @ts-expect-error dynamic assignment via setter
				this[key] = source[key]
			}
		}
	}
}
