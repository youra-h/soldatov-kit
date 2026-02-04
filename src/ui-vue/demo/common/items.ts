/**
 * Общие списки для селекторов в демо-компонентах
 */
import type { TComponentSize, TComponentVariant, TButtonAppearance } from '@/core'

/** Размеры компонентов */
export const SIZES: TComponentSize[] = ['sm', 'normal', 'auto', 'lg', 'xl', '2xl']

/** Варианты компонентов */
export const VARIANTS: TComponentVariant[] = ['normal', 'primary', 'danger', 'warning', 'success']

/** HTML теги для ComponentView */
export const HTML_TAGS = ['div', 'span', 'section', 'article', 'header', 'footer', 'main', 'aside']

/** Внешний вид кнопок */
export const BUTTON_APPEARANCES: TButtonAppearance[] = ['normal', 'plain', 'outlined']

/** Пути к иконкам (можно расширить) */
export const ICON_PATHS = [
	'/src/icons/home.svg',
	'/src/icons/check_indeterminate.svg',
	'/src/icons/check.svg',
	'/src/icons/close.svg',
]
