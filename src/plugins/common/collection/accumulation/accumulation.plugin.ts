import { TBasePlugin } from '../../../base/plugin'
import { TInstancePlugin } from '../../instance'
import { TCollectionItemPlugins } from '../item-plugins.plugin'
import type { IPluginBundle } from '../../../base/types'

/**
 * Базовый плагин для накопления (accumulation) значений элементов коллекции.
 *
 * Слушает {@link TCollectionItemPlugins}, извлекает значение указанного типа
 * из бандла каждого item'а и поддерживает упорядоченный {@link items} —
 * порядок соответствует порядку элементов в коллекции.
 *
 * @template TValue — тип накапливаемых значений (HTMLElement | IComponentView)
 * @template TCustomEvents — события конкретной реализации
 */
export abstract class TAccumulationPlugin<
	TValue,
	TCustomEvents extends Record<string, (...args: any) => any> = {},
> extends TBasePlugin<TCustomEvents> {
	private readonly _items = new Map<string | number, TValue>()
	private _collection: any = null

	/** Упорядоченный реестр накопленных значений. Порядок соответствует коллекции. */
	get items(): ReadonlyMap<string | number, TValue> {
		return this._items
	}

	/**
	 * Подписывается на события готовности/удаления источника.
	 * Вызывается при `item:registered`. Должна вызывать
	 * `this._add(uid, value)` (если значение уже готово) и
	 * подписываться на будущие `ready`/`removed`.
	 */
	protected abstract _track(uid: string | number, bundle: IPluginBundle): void

	/** Добавить значение в реестр. */
	protected _add(uid: string | number, value: TValue): void {
		this._items.set(uid, value)
	}

	/** Удалить значение из реестра. */
	protected _remove(uid: string | number): void {
		this._items.delete(uid)
	}

	override install(bundle: IPluginBundle): void {
		const instancePlugin = bundle.get(TInstancePlugin)

		instancePlugin?.events.on('ready', ({ instance }: { instance: any }) => {
			this._collection = instance.collection ?? instance
			this._collection.events.on('item:moved', () => this._reorder())
		})

		const itemPlugins = bundle.get(TCollectionItemPlugins)

		itemPlugins?.events.on('item:registered', ({ uid, bundle: itemBundle }) => {
			this._track(uid, itemBundle)
		})

		itemPlugins?.events.on('item:unregistered', ({ uid }) => {
			this._remove(uid)
		})
	}

	private _reorder(): void {
		if (!this._collection) return

		const old = new Map(this._items)

		this._items.clear()

		for (const item of this._collection.items) {
			const uid = (item as any).uid
			if (old.has(uid)) this._items.set(uid, old.get(uid)!)
		}
	}

	// --- accessors ---

	getByUid(uid: string | number): TValue | null {
		return this._items.get(uid) ?? null
	}

	getByIndex(index: number): TValue | null {
		return Array.from(this._items.values())[index] ?? null
	}

	getUidByValue(value: TValue): string | number | null {
		for (const [uid, v] of this._items) {
			if (v === value) return uid
		}
		return null
	}

	getAll(): TValue[] {
		return Array.from(this._items.values())
	}

	getVisible(): TValue[] {
		return Array.from(this._items.values())
	}
}
