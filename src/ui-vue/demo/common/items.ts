/**
 * Общие списки для селекторов в демо-компонентах
 */

export type TComponentSize = 'sm' | 'normal' | 'auto' | 'lg' | 'xl' | '2xl'
export type TComponentVariant = 'normal' | 'primary' | 'danger' | 'warning' | 'success'
export type TButtonAppearance = 'normal' | 'plain' | 'outlined'

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
	'/src/icons/user.svg',
	'/src/icons/settings.svg',
	'/src/icons/search.svg',
]
