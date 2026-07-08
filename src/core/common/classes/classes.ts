import { TEvented } from '../event/evented'
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

	/**
	 * Формирует CSS-класс из `entry` с учётом опций.
	 *
	 * @param entry — суффикс или полное имя класса
	 * @param options.withBase — если `true` (по умолчанию), предваряет результат базовым классом
	 * @param options.point — если `true`, добавляет `.` в начале (для использования в `querySelector`)
	 * @returns итоговый CSS-класс
	 */
	resolve(entry: string, options?: { withBase?: boolean; point?: boolean }): string {
		const withBase = options?.withBase ?? true
		const point = options?.point ?? false

		const cls = withBase ? `${this._base}${entry}` : entry

		return point ? `.${cls}` : cls
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
			const cls = this.resolve(entry, { withBase })

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
		const cls = this.resolve(entry, { withBase })

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

	/**
	 * Удаляет класс со старым значением и добавляет с новым.
	 * @param prefix — префикс для класса
	 * @param oldValue — старое значение
	 * @param newValue — новое значение
	 * @param withBase — если `true`, строка автоматически предваряется базовым классом
	 */
	swap({
		prefix,
		oldValue,
		newValue,
		withBase = true,
	}: {
		prefix: string
		oldValue?: string
		newValue?: string
		withBase?: boolean
	}): this {
		if (oldValue) {
			this.remove(`${prefix}${oldValue}`, withBase)
		}

		if (newValue && newValue.trim() !== '' && newValue !== oldValue) {
			this.add(`${prefix}${newValue}`, withBase)
		}

		return this
	}

	/**
	 * Удаляет `oldClass` и добавляет `newClass`.
	 * @param withBase — если `true`, оба класса автоматически предваряются базовым классом
	 */
	swapClass({
		oldClass,
		newClass,
		withBase = true,
	}: {
		oldClass: string
		newClass: string
		withBase?: boolean
	}): this {
		this.remove(oldClass, withBase)

		if (newClass.trim() !== '' && newClass !== oldClass) {
			this.add(newClass, withBase)
		}

		return this
	}

	/**
	 * Поиск по классум. Проверяет только статические классы, динамические игнорирует.
	 * @param suffix — текст для поиска. Если `withBase === true`, строка автоматически предваряется базовым классом
	 * @param withBase — если `true`, строка автоматически предваряется базовым классом
	 * @return `true` если класс присутствует, `false` если нет
	 */
	has(suffix: string, withBase = true): boolean {
		const cls = this.resolve(suffix, { withBase })

		return this._statics.has(cls)
	}

	/**
	 * Вернуть полное наименование класса по его суффиксу. Например, при базовом классе `tk-btn` и наличии в статических классах `tk-btn--size-s` вызов `get('--size-s')` вернёт `tk-btn--size-s`.
	 * Проверяет только статические классы, динамические игнорирует.
	 * @param suffix — суффикс класса. Если `withBase === true`, строка автоматически предваряется базовым классом
	 * @param withBase — если `true`, строка автоматически предваряется базовым классом
	 * @return полное наименование класса или `undefined` если класс не найден
	 */
	get(suffix: string, withBase = true): string | undefined {
		const target = this.resolve(suffix, { withBase })

		for (const cls of this._statics) {
			if (cls.endsWith(target)) {
				return cls
			}
		}

		return undefined
	}

	/** Список всех классов в виде массива строк. */
	get list(): string[] {
		return this.toArray()
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
