let _counter = 0

/**
 * Генерирует уникальный числовой идентификатор.
 * Монотонно возрастает в пределах одной сессии приложения.
 */
export function createUid(): number {
	return ++_counter
}
