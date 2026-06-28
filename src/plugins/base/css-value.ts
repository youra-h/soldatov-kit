const CSS_UNIT_RE = /^-?\d+(\.\d+)?$/u

/**
 * Приводит значение к CSS-строке.
 * - Число → `${value}px`
 * - Строка-число (например `'100'`) → `'100px'`
 * - Строка с единицей (например `'50%'`, `'1rem'`) → как есть
 * - `'auto'` → как есть
 */
export function toCssValue(value: string | number): string {
	if (typeof value === 'number') {
		return `${value}px`
	}

	if (CSS_UNIT_RE.test(value)) {
		return `${value}px`
	}

	return value
}
