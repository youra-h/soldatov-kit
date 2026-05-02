import { TEvented } from '../../../core/common/evented'
import type { IPlugin, IPluginContext, IPluginContainer } from './types'

/**
 * Базовый плагин.
 *
 * Внутри только логика сохранения данных из setContext (обновление _container, _el и etc).
 */
export abstract class TPlugin<TEvents extends Record<string, (...args: any[]) => any> = {}>
	implements IPlugin<TEvents>
{
	readonly events = new TEvented<TEvents>()

	/** Контейнер плагинов (приходит при use) */
	protected container: IPluginContainer | undefined

	/** Ожидаемые параметры (DOM элемент компонента и бизнес-core инстанс) */
	protected el: Element | null = null
	protected instance: any = undefined

	setContext(context: Partial<IPluginContext>): void {
		// Обычное присвоение приходящих данных. Если они пришли - обновляем
		this.container = context.container ?? this.container
		this.el = context.el ?? this.el
		this.instance = context.instance ?? this.instance

		// Наследники сами могут переопределить setContext и вызывать super.setContext,
		// чтобы реагировать на приходящие данные (например, на появление this.el).
	}

	abstract uninstall(): void
}
