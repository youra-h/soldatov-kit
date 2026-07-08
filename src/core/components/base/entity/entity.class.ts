import type { TEntityProps, IEntity } from './types'
import { createUid } from '../../common/uid'

export abstract class TEntity<TProps extends TEntityProps = TEntityProps> implements IEntity<TProps> {
	/** Уникальный идентификатор объекта в рамках текущей сессии */
	public readonly uid: number = createUid()

	getProps(): Readonly<TProps> {
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

	/**
	 * Сериализация объекта в JSON.
	 * Возвращает копию props, пригодную для сохранения или передачи.
	 */
	toJSON(): TProps {
		return { ...this.getProps() } as TProps
	}
}
