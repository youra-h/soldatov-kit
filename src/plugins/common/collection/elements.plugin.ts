import { TBasePlugin } from '../../base/plugin'
import { TElementPlugin } from '../element'
import { TInstancePlugin } from '../instance'
import type { IPluginBundle } from '../../base/types'
import type { TCollectionElementsPluginEvents } from './types'

export class TCollectionElementsPlugin extends TBasePlugin<TCollectionElementsPluginEvents> {
	static readonly key = 'collection-elements'

	private readonly _elements = new Map<string | number, HTMLElement>()
	private readonly _present = new Map<string | number, boolean>()

	get elements(): ReadonlyMap<string | number, HTMLElement> {
		return this._elements
	}

	/**
	 * Регистрирует дочерний bundle: подписывается на TElementPlugin этого bundle
	 * и отслеживает появление/исчезновение элемента.
	 * Вызывается из Vue-компонента при получении события ready дочернего компонента.
	 */
	async register(uid: string | number, bundle: IPluginBundle): Promise<void> {
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
			this._present.delete(uid)
			this.events.emit('element:removed', { uid })
		})

		// Отслеживаем present (rendered && visible) через инстанс
		const instancePlugin = bundle.get(TInstancePlugin)

		if (instancePlugin) {
			const instance = await instancePlugin.whenReady()

			this._present.set(uid, instance.present)

			instance.events.on('change:present', (value: boolean) => {
				this._present.set(uid, value)
				this.events.emit('element:present', { uid, present: value })
			})
		}
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
	 * Возвращает uid по HTML-элементу (reverse lookup).
	 */
	getUidByElement(el: HTMLElement): string | number | null {
		for (const [uid, element] of this._elements) {
			if (element === el) return uid
		}
		return null
	}

	/**
	 * Возвращает все зарегистрированные HTML-элементы.
	 */
	getAll(): HTMLElement[] {
		return Array.from(this._elements.values())
	}

	/**
	 * Возвращает только видимые HTML-элементы (present === true).
	 */
	getVisible(): HTMLElement[] {
		const result: HTMLElement[] = []

		for (const [uid, element] of this._elements) {
			if (this._present.get(uid) === true) {
				result.push(element)
			}
		}

		return result
	}
}
