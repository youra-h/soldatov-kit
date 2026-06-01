import type { ICollection } from '../../../core'
import { TBasePlugin } from '../../base/plugin'
import { TElementPlugin } from '../element'
import { TCollectionElementsPlugin } from '../collection'
import type { IPluginBundle } from '../../base/types'
import type { TDragPluginEvents } from './types'
import { TEvented } from '../../../core/common/evented'

export class TDragPlugin extends TBasePlugin<TDragPluginEvents> {
	static readonly key = 'drag'

	private _active = false
	private _collection: ICollection | null = null
	private _element: HTMLElement | null = null
	private _elementPlugin: TElementPlugin | null = null
	private _collectionPlugin: TCollectionElementsPlugin | null = null
	private _cleanup: (() => void) | null = null

	override install(bundle: IPluginBundle): void {
		this._elementPlugin = bundle.get(TElementPlugin) ?? null
		this._collectionPlugin = bundle.get(TCollectionElementsPlugin) ?? null

		this._elementPlugin?.events.on('ready', ({ element }) => {
			this._element = element
			if (this._active) this._setup()
		})

		this._elementPlugin?.events.on('removed', () => {
			this._teardown()
			this._element = null
		})
	}

	activate(collection: ICollection): void {
		this._collection = collection
		this._active = true
		if (this._element) this._setup()
	}

	deactivate(): void {
		this._teardown()
		this._active = false
		this._collection = null
	}

	private _setup(): void {
		const element = this._element!
		const collection = this._collection!
		const collectionPlugin = this._collectionPlugin!

		let draggingIndex: number | null = null

		collectionPlugin.getAll().forEach((el) => el.setAttribute('draggable', 'true'))

		const onElementAdded = ({ element: itemEl }: { uid: string | number; element: HTMLElement }) => {
			itemEl.setAttribute('draggable', 'true')
		}

		collectionPlugin.events.on('element:added', onElementAdded)

		const onDragStart = (e: DragEvent) => {
			const target = (e.target as HTMLElement).closest('[draggable="true"]') as HTMLElement | null
			if (!target || !element.contains(target)) return

			const uid = collectionPlugin.getUidByElement(target)
			if (uid === null) return

			draggingIndex = collection.getItems().findIndex((item) => item.uid === uid)
			if (draggingIndex === -1) {
				draggingIndex = null
				return
			}

			e.dataTransfer!.effectAllowed = 'move'
			target.style.opacity = '0.4'
			;(this.events as TEvented<TDragPluginEvents>).emit('drag:start', {
				index: draggingIndex,
				uid: uid as number,
			})
		}

		const onDragEnd = (e: DragEvent) => {
			const target = (e.target as HTMLElement).closest('[draggable="true"]') as HTMLElement | null
			if (target) target.style.opacity = ''
			draggingIndex = null
			;(this.events as TEvented<TDragPluginEvents>).emit('drag:end')
		}

		const onDragOver = (e: DragEvent) => {
			e.preventDefault()
			e.dataTransfer!.dropEffect = 'move'
			if (draggingIndex === null) return

			const target = (e.target as HTMLElement).closest('[draggable="true"]') as HTMLElement | null
			if (!target || !element.contains(target)) return

			const targetUid = collectionPlugin.getUidByElement(target)
			if (targetUid === null) return

			const targetIndex = collection.getItems().findIndex((item) => item.uid === targetUid)
			if (targetIndex === -1 || targetIndex === draggingIndex) return

			collection.move(draggingIndex, targetIndex)
			draggingIndex = targetIndex
		}

		element.addEventListener('dragstart', onDragStart)
		element.addEventListener('dragend', onDragEnd)
		element.addEventListener('dragover', onDragOver)

		this._cleanup = () => {
			element.removeEventListener('dragstart', onDragStart)
			element.removeEventListener('dragend', onDragEnd)
			element.removeEventListener('dragover', onDragOver)
			collectionPlugin.events.off('element:added', onElementAdded)
			collectionPlugin.getAll().forEach((el) => el.removeAttribute('draggable'))
		}
	}

	private _teardown(): void {
		this._cleanup?.()
		this._cleanup = null
	}

	override destroy(): void {
		this._teardown()
		super.destroy()
	}
}
