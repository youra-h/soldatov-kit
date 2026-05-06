import { TEvented } from '../evented'
import type { TClassEntry, TClassesEvents } from './types'

/** Управляет набором CSS-классов компонента: базовым, статическими и динамическими. */
export class TClasses {
	/** Базовый класс (всегда первый в списке). */
	private _base: string
	/** Статические классы, добавленные через `add(string)`. */
	private _statics: Set<string> = new Set()
	/** Динамические классы — функции, вычисляемые при каждом вызове `toArray()`. */
	private _dynamics: Array<() => string | null | undefined | false> = []

	/** Эмиттер событий. `change` — при любом изменении набора классов. */
	readonly events = new TEvented<TClassesEvents>()

	/**
	 * @param base — базовый CSS-класс компонента
	 * @param initial — начальные статические классы
	 */
	constructor(base: string, initial: string[] = []) {
		this._base = base
		for (const cls of initial) {
			this._statics.add(cls)
		}
	}

	/** Базовый CSS-класс. */
	get base(): string {
		return this._base
	}

	/** Заменяет базовый класс. Эмитит `change` если значение изменилось. */
	setBase(base: string): this {
		if (this._base === base) return this

		this._base = base
		this.events.emit('change')

		return this
	}

	/** Если `withBase === true` — возвращает `base + entry`, иначе `entry` как есть. */
	private _resolve(entry: string, withBase: boolean): string {
		return withBase ? `${this._base}${entry}` : entry
	}

	/**
	 * Добавляет статический класс (строку) или динамическую функцию.
	 * Статический класс добавляется только если его ещё нет.
	 * Динамическая функция добавляется всегда (дубликаты не проверяются).
	 * Эмитит `change` если запись была добавлена.
	 * @param withBase — если `true`, строка автоматически предваряется базовым классом
	 */
	add(entry: TClassEntry, withBase = true): this {
		if (typeof entry === 'function') {
			this._dynamics.push(entry)
			this.events.emit('change')
		} else {
			const cls = this._resolve(entry, withBase)

			if (!this._statics.has(cls)) {
				this._statics.add(cls)
				this.events.emit('change')
			}
		}

		return this
	}

	/**
	 * Удаляет статический класс. Эмитит `change` если класс присутствовал.
	 * @param withBase — если `true`, строка автоматически предваряется базовым классом
	 */
	remove(entry: string, withBase = true): this {
		const cls = this._resolve(entry, withBase)

		if (this._statics.has(cls)) {
			this._statics.delete(cls)
			this.events.emit('change')
		}

		return this
	}

	/**
	 * Добавляет класс если `value === true`, удаляет если `false`.
	 * @param withBase — если `true`, строка автоматически предваряется базовым классом
	 */
	toggle(entry: string, value: boolean, withBase = true): this {
		return value ? this.add(entry, withBase) : this.remove(entry, withBase)
	}

	/** Возвращает итоговый список классов: `[base, ...statics, ...computed dynamics]`. */
	toArray(): string[] {
		const result: string[] = [this._base, ...this._statics]

		for (const fn of this._dynamics) {
			const val = fn()
			if (val) result.push(val)
		}

		return result
	}

	/**
	 * Возвращает итоговую строку классов, разделённых пробелами.
	 * @returns Строка вида `"base static1 static2 dynamic1 dynamic2"`. Динамические классы вычисляются при каждом вызове.
	 */
	toString(): string {
		return this.toArray().join(' ')
	}

	/**
	 * Позволяет использовать `TClasses` в местах, где ожидается строка классов (например, при рендеринге).
	 * Вызывает `toArray()` для получения актуального списка классов.
	 * @returns Массив классов, который может быть преобразован в строку при необходимости.
	 */
	valueOf(): string[] {
		return this.toArray()
	}
}
