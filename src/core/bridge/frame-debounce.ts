/**
 * Возвращает debounced-версию функции fn, отложенную на следующий requestAnimationFrame.
 * Повторные вызовы до срабатывания rAF отменяют предыдущий — выполнится только последний.
 */
export function frameDebounce<T extends (...args: any[]) => void>(fn: T): T {
	let id: number | null = null

	return ((...args: any[]) => {
		if (id !== null) {
			cancelAnimationFrame(id)
		}

		id = requestAnimationFrame(() => {
			id = null
			fn(...args)
		})
	}) as T
}
