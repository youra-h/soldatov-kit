// hierarchical-with-strategy.ts
import { TEvented } from './../../../common/evented'
import type { ICollection } from './../types'
import type { ICollectionItem } from './../item/types'
import type { IActiveStrategy, ISelectionStrategy, NodeRef } from './types'

/**
 * TreeNode — обёртка, позволяющая связать элемент коллекции с дочерней коллекцией.
 * Используется, когда элемент сам содержит вложенную коллекцию (например, пункт меню).
 */
export interface TreeNode {
	item: ICollectionItem
	children?: Array<ICollection | TreeNode>
}

/**
 * Элементы дерева могут быть:
 * - коллекциями (ICollection),
 * - TreeNode (элемент + children),
 * - или просто элементами (ICollectionItem) — редко используется как корень.
 */
export type TreeChild = ICollection | TreeNode | ICollectionItem

export class HierarchicalCollectionWithStrategy {
	private _children: TreeChild[] = []
	public readonly events = new TEvented<Record<string, any>>()

	constructor(
		private options?: {
			activeStrategy?: IActiveStrategy
			selectionStrategy?: ISelectionStrategy
		},
	) {}

	add(child: TreeChild) {
		this._children.push(child)
		if (this.options?.activeStrategy && this.isCollection(child))
			this.options.activeStrategy.onAttach(child)
		if (this.options?.selectionStrategy && this.isCollection(child))
			this.options.selectionStrategy.onAttach(child)
		this.subscribeChild(child)
		this.events.emit('nodeAdded', { node: child })
	}

	remove(child: TreeChild) {
		const idx = this._children.indexOf(child)
		if (idx === -1) return
		this._children.splice(idx, 1)
		this.unsubscribeChild(child)
		if (this.options?.activeStrategy && this.isCollection(child))
			this.options.activeStrategy.onDetach(child)
		if (this.options?.selectionStrategy && this.isCollection(child))
			this.options.selectionStrategy.onDetach(child)
		this.events.emit('nodeRemoved', { node: child })
	}

	/** Итеративный поиск пути к target. Возвращает массив индексов (path) или undefined */
	findPathFor(target: ICollectionItem | TreeChild): number[] | undefined {
		type StackItem = { node: { children: TreeChild[] }; path: number[] }
		const root = { children: this._children }
		const stack: StackItem[] = [{ node: root, path: [] }]

		while (stack.length) {
			const { node, path } = stack.pop()!
			const items = node.children ?? []
			for (let i = 0; i < items.length; i++) {
				const it = items[i]
				const curPath = path.concat(i)

				// direct match for item or collection wrapper
				if (it === target) return curPath

				// if it is a collection, iterate its elements
				if (this.isCollection(it)) {
					const arr = it.toArray()
					for (let j = 0; j < arr.length; j++) {
						if (arr[j] === target) return curPath.concat(j)
						// if element is TreeNode-like (has children), push to stack
						const maybeNode = arr[j] as unknown as TreeNode
						if (maybeNode?.children)
							stack.push({
								node: { children: maybeNode.children },
								path: curPath.concat(j),
							})
					}
				}

				// if it is TreeNode, check its item and push its children
				if (this.isTreeNode(it)) {
					if (it.item === target) return curPath
					if (it.children && it.children.length)
						stack.push({ node: { children: it.children }, path: curPath })
				}

				// if it is an item that has children (rare), check children property
				const maybeNode = it as unknown as TreeNode
				if (maybeNode?.children)
					stack.push({ node: { children: maybeNode.children }, path: curPath })
			}
		}

		return undefined
	}

	/** Подписываемся на события дочерних коллекций/узлов */
	private subscribeChild(child: TreeChild) {
		// коллекции у нас имеют events: TEvented
		if (this.isCollection(child)) {
			const c = child
			const activeHandler = (payload: {
				collection: ICollection
				item?: ICollectionItem
			}) => {
				const node = payload?.item
				const path = node ? (this.findPathFor(node) ?? []) : []
				const nodeRef: NodeRef | undefined = node
					? { node, collection: c, path }
					: undefined

				this.options?.activeStrategy?.handleActiveEvent(c, payload, nodeRef)
				this.events.emit('activeChanged', { source: c, payload, nodeRef })
			}

			const selectionHandler = (payload: {
				collection: ICollection
				items: ICollectionItem[]
			}) => {
				// payload.items — текущие выбранные элементы в коллекции
				const node = payload?.items?.[0]
				const path = node ? (this.findPathFor(node) ?? []) : []
				const nodeRef: NodeRef | undefined = node
					? { node, collection: c, path }
					: undefined

				this.options?.selectionStrategy?.handleSelectionEvent(c, payload, nodeRef)
				this.events.emit('selectionChanged', { source: c, payload, nodeRef })
			}

			const clickHandler = (payload: { node: ICollectionItem }) => {
				const node = payload?.node
				const path = node ? (this.findPathFor(node) ?? []) : []
				const nodeRef: NodeRef | undefined = node
					? { node, collection: c, path }
					: undefined
				this.events.emit('click', { source: c, payload, nodeRef })
			}

			// сохраняем обработчики для отписки
			;(c as any).__hierarchicalHandlers = { activeHandler, selectionHandler, clickHandler }

			c.events.on('change' as any, activeHandler) // activatable emits 'change' with item
			c.events.on('change' as any, selectionHandler) // selectable emits 'change' with items
			c.events.on('click' as any, clickHandler)
			return
		}

		// если child — TreeNode, подписываемся на его children (рекурсивно)
		if (this.isTreeNode(child) && child.children) {
			for (const ch of child.children) this.subscribeChild(ch)
		}
	}

	private unsubscribeChild(child: TreeChild) {
		if (this.isCollection(child)) {
			const c = child
			const handlers = (c as any).__hierarchicalHandlers
			if (!handlers) return
			c.events.off('change' as any, handlers.activeHandler)
			c.events.off('change' as any, handlers.selectionHandler)
			c.events.off('click' as any, handlers.clickHandler)
			delete (c as any).__hierarchicalHandlers
			return
		}
		if (this.isTreeNode(child) && child.children) {
			for (const ch of child.children) this.unsubscribeChild(ch)
		}
	}

	// API: агрегированные состояния
	get activeItem(): ICollectionItem | undefined {
		return this.options?.activeStrategy?.getActive?.()
	}

	get activePath(): number[] | undefined {
		return this.options?.activeStrategy?.getActivePath?.()
	}

	get selectedItems(): ICollectionItem[] {
		return this.options?.selectionStrategy?.getSelected?.() ?? []
	}

	// Установить активный узел через дерево (делегируем стратегии)
	setActive(node: ICollectionItem) {
		const path = this.findPathFor(node)
		if (!path) return
		const collection = node.collection ?? null
		const nodeRef: NodeRef = { node, collection, path }
		this.options?.activeStrategy?.handleActiveEvent(
			collection as ICollection,
			{ node },
			nodeRef,
		)
		this.events.emit('activeChanged', { new: node, path })
	}

	// type guards
	private isCollection(x: TreeChild): x is ICollection {
		return (
			!!x && typeof (x as ICollection).toArray === 'function' && !!(x as ICollection).events
		)
	}

	private isTreeNode(x: TreeChild): x is TreeNode {
		return !!x && typeof (x as TreeNode).item !== 'undefined'
	}
}
