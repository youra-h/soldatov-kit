import type { TComponentSize } from './types'

const SIZE_SCALE: readonly TComponentSize[] = ['sm', 'normal', 'lg', 'xl', '2xl']

/**
 * Сдвигает размер на `delta` шагов по шкале.
 * `+1` — увеличение, `-1` — уменьшение.
 * Не выходит за границы шкалы.
 *
 * @example shiftSize('normal', -1) // 'sm'
 * @example shiftSize('2xl', 1)    // '2xl' (потолок)
 */
export function shiftSize(size: TComponentSize, delta: number): TComponentSize {
	const idx = SIZE_SCALE.indexOf(size)
	return SIZE_SCALE[idx + delta] ?? size
}
