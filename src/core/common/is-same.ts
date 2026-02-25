import type { IEntity } from '../base/entity'

/**
 * Сравнивает два объекта (компоненты, элементы коллекций и т.п.) по uid,
 * независимо от Proxy-обёрток реактивных фреймворков.
 *
 * @param current Текущий объект (например, активный элемент)
 * @param candidate Кандидат для сравнения (например, новый выбранный элемент)
 */
export function isSame(
	current: IEntity | null | undefined,
	candidate: IEntity | null | undefined,
): boolean {
	if (current === candidate) return true

	if (!current || !candidate) return false

	return current.uid === candidate.uid
}

