import type { TEvented } from '../../../core/common/evented'

/**
 * Контекст, который передается в плагины.
 * Содержит контейнер, DOM-элемент, инстанс core-компонента и любые другие данные.
 */
export interface IPluginContext {
	container?: IPluginContainer
	el?: Element | null
	instance?: any
	[key: string]: any
}

/**
 * Базовый контракт плагина.
 * Никаких лишних хуков. Жизненный цикл управляется через конструктор, setContext и uninstall.
 */
export interface IPlugin<TEvents extends Record<string, (...args: any[]) => any> = {}> {
	readonly events: TEvented<TEvents>

	/** Единственный метод для получения данных снаружи (от контейнера или Vue) */
	setContext(context: Partial<IPluginContext>): void

	/** Очистка ресурсов (отписки) перед удалением плагина */
	uninstall(): void
}

/**
 * Конструктор плагина с обязательным статическим ключом.
 */
export interface IPluginCtor<T extends IPlugin<any>> {
	readonly key: string
	new (): T
}

export type TPluginContainerEvents = {
	/** Срабатывает, когда в контейнер добавлен новый плагин */
	install: (payload: { plugin: IPlugin<any>; key: string }) => void
}

/**
 * Контейнер плагинов.
 */
export interface IPluginContainer {
	readonly events: TEvented<TPluginContainerEvents>

	/** Добавить плагин по классу */
	use<T extends IPlugin<any>>(Ctor: IPluginCtor<T>): T

	/** Получить плагин по ключу */
	get<T extends IPlugin<any>>(key: string): T | undefined

	/** Удалить плагин по ключу */
	remove(key: string): void
}
