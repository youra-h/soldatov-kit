import { TBasePlugin } from '../../base/plugin'
import { TElementPlugin } from '../element'
import type { IPluginBundle } from '../../base/types'
import type { TCollectionElementsPluginEvents } from './types'

export class TCollectionElementsPlugin extends TBasePlugin<TCollectionElementsPluginEvents> {
	static readonly key = 'collection-elements'

	private readonly _elements = new Map<string | number, HTMLElement>()

	/**
	 * Регистрирует дочерний bundle: подписывается на TElementPlugin этого bundle
	 * и отслеживает появление/исчезновение элемента.
	 * Вызывается из Vue-компонента при получении события ready дочернего компонента.
	 */
	register(uid: string | number, bundle: IPluginBundle): void {
		const elementPlugin = bundle.get(TElementPlugin)

		if (!elementPlugin) return

		// Элемент уже доступен в момент вызова (register вызывается из @ready)
		if (elementPlugin.element) {
			this._elements.set(uid, elementPlugin.element)
			this.events.emit('element:added', { uid, element: elementPlugin.element })
		}

		elementPlugin.events.on('ready', ({ element }) => {
			this._elements.set(uid, element)
			this.events.emit('element:added', { uid, element })
		})

		elementPlugin.events.on('removed', () => {
			this._elements.delete(uid)
			this.events.emit('element:removed', { uid })
		})
	}

	/**
	 * Возвращает HTML-элемент по uid компонента.
	 */
	getByUid(uid: string | number): HTMLElement | null {
		return this._elements.get(uid) ?? null
	}

	/**
	 * Возвращает HTML-элемент по индексу (в порядке регистрации, соответствует порядку v-for).
	 */
	getByIndex(index: number): HTMLElement | null {
		return Array.from(this._elements.values())[index] ?? null
	}

	/**
	 * Возвращает все зарегистрированные HTML-элементы.
	 */
	getAll(): HTMLElement[] {
		return Array.from(this._elements.values())
	}
}
