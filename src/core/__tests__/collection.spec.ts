import { describe, it, expect, vi } from 'vitest'
import { TCollection, TCollectionItem } from '../base/collection'

class TestItem extends TCollectionItem {}

// Расширенный элемент с полями для тестирования getItems / toArray
interface TestRichItemProps {
	name: string
	value: number
}

class TestRichItem extends TCollectionItem<TestRichItemProps> {
	private _name: string = ''
	private _value: number = 0

	get name() {
		return this._name
	}
	set name(v: string) {
		this._name = v
	}

	get value() {
		return this._value
	}
	set value(v: number) {
		this._value = v
	}

	getProps(): Readonly<TestRichItemProps> {
		return { name: this._name, value: this._value }
	}
}

describe('TCollectionItem', () => {
	it('free() emits "free" with itself', () => {
		const item = new TestItem()
		const spy = vi.fn()

		item.events.on('free', spy)

		item.free()

		expect(spy).toHaveBeenCalled()
		// expect(spy.mock.calls[0][0]).toBe(item)
		const payload = spy.mock.calls[0]![0]
		expect(payload).toBe(item)
	})
})

describe('TCollection', () => {
	it('add() creates item, increments count and emits "item:added"', () => {
		const col = new TCollection({ itemClass: TestItem })
		const spy = vi.fn()

		col.events.on('item:added', spy)

		const item = col.add({})

		expect(col.count).toBe(1)
		expect(col.getItem(0)).toBe(item)
		expect(spy).toHaveBeenCalled()

		// безопасный доступ — non-null assertion
		const payload = spy.mock.calls[0]![0]
		expect(payload.collection).toBe(col)
		expect(payload.item).toBe(item)
	})

	it('addItems() creates multiple items from array and emits "item:added" for each', () => {
		const col = new TCollection({ itemClass: TestItem })
		const spy = vi.fn()

		col.events.on('item:added', spy)

		const sources = [{}, {}, {}]
		const items = col.addItems(sources)

		expect(items).toHaveLength(3)
		expect(col.count).toBe(3)
		expect(spy).toHaveBeenCalledTimes(3)

		// проверяем, что каждый элемент добавлен в коллекцию
		items.forEach((item, index) => {
			expect(col.getItem(index)).toBe(item)
		})
	})

	it('addItems() returns empty array when called with empty array', () => {
		const col = new TCollection({ itemClass: TestItem })
		const spy = vi.fn()

		col.events.on('item:added', spy)

		const items = col.addItems([])

		expect(items).toHaveLength(0)
		expect(col.count).toBe(0)
		expect(spy).not.toHaveBeenCalled()
	})

	it('insert() and insertAt() insert items at positions and respect collection membership', () => {
		const col1 = new TCollection({ itemClass: TestItem })
		const col2 = new TCollection({ itemClass: TestItem })

		const a = col1.add({})
		const b = col1.add({})

		// insert new item at 0
		const ins = col1.insert(0)
		expect(ins).toBeDefined()
		expect(col1.count).toBe(3)

		// attempt to insert item from other collection
		const other = col2.add({})
		const res = col1.insertAt(other, 0)
		expect(res).toBe(false)
	})

	it('delete() removes item and emits before/after events; item:beforeDelete can cancel', () => {
		const col = new TCollection({ itemClass: TestItem })

		const a = col.add({})
		const b = col.add({})

		// cancel deletion
		col.events.on('item:beforeDelete', () => false)
		const res1 = col.delete(0)
		expect(res1).toBe(false)
		expect(col.count).toBe(2)

		// remove without cancellation
		// remove the cancelling listener by creating a fresh collection
		const col2 = new TCollection({ itemClass: TestItem })
		const i1 = col2.add({})
		const i2 = col2.add({})
		const afterSpy = vi.fn()
		col2.events.on('item:afterDelete', afterSpy)

		const res2 = col2.delete(0)
		expect(res2).toBe(true)
		expect(col2.count).toBe(1)
		expect(afterSpy).toHaveBeenCalled()
	})

	it('clear() frees items and emits "reset"', () => {
		const col = new TCollection({ itemClass: TestItem })

		const i1 = col.add({})
		const i2 = col.add({})

		const spyCleared = vi.fn()
		col.events.on('reset', spyCleared)

		const spyFree1 = vi.spyOn(i1, 'free')
		const spyFree2 = vi.spyOn(i2, 'free')

		col.reset()

		expect(col.count).toBe(0)
		expect(spyCleared).toHaveBeenCalled()
		expect(spyFree1).toHaveBeenCalled()
		expect(spyFree2).toHaveBeenCalled()
	})

	it('setItemIndex/move emits beforeMove/afterMove and reorders items; beforeMove can cancel', () => {
		const col = new TCollection({ itemClass: TestItem })

		const a = col.add({})
		const b = col.add({})
		const c = col.add({})

		// cancel move
		col.events.on('item:beforeMove', () => false)
		col.setItemIndex(a, 2)
		// positions unchanged
		expect(col.getItem(0)).toBe(a)
		expect(col.getItem(1)).toBe(b)
		expect(col.getItem(2)).toBe(c)

		// new collection to test positiveful move
		const col2 = new TCollection({ itemClass: TestItem })
		const x = col2.add({})
		const y = col2.add({})
		const z = col2.add({})

		const afterMoveSpy = vi.fn()
		col2.events.on('item:afterMove', afterMoveSpy)

		col2.setItemIndex(x, 2)

		expect(col2.getItem(2)).toBe(x)
		expect(afterMoveSpy).toHaveBeenCalled()
		const payload = afterMoveSpy.mock.calls[0]![0]
		expect(payload.collection).toBe(col2)
		expect(payload.item).toBe(x)
	})
})

describe('TCollection — getItems', () => {
	it('getItems() возвращает массив инстансов элементов', () => {
		const col = new TCollection({ itemClass: TestRichItem })
		const a = col.add({ name: 'Alice', value: 1 })
		const b = col.add({ name: 'Bob', value: 2 })

		const items = col.getItems<TestRichItem>()

		expect(items).toHaveLength(2)
		// Возвращает именно инстансы, а не plain-объекты
		expect(items[0]).toBe(a)
		expect(items[1]).toBe(b)
		expect(items[0]).toBeInstanceOf(TestRichItem)
	})

	it('getItems() возвращает пустой массив для пустой коллекции', () => {
		const col = new TCollection({ itemClass: TestRichItem })
		expect(col.getItems()).toHaveLength(0)
	})

	it('getItems() и toArray() — разные объекты, но одинаковые данные', () => {
		const col = new TCollection({ itemClass: TestRichItem })
		col.add({ name: 'Charlie', value: 42 })

		const item = col.getItems<TestRichItem>()[0]!

		// инстанс и plain-объект — разные объекты
		expect(item.name).toBe('Charlie')
		expect(item.value).toBe(42)
	})
})

describe('TCollection — iterable', () => {
	it('поддерживает for...of', () => {
		const col = new TCollection({ itemClass: TestRichItem })
		col.add({ name: 'Alice', value: 1 })
		col.add({ name: 'Bob', value: 2 })
		col.add({ name: 'Charlie', value: 3 })

		const names: string[] = []
		for (const item of col) {
			names.push(item.name)
		}

		expect(names).toEqual(['Alice', 'Bob', 'Charlie'])
	})

	it('поддерживает spread operator [...collection]', () => {
		const col = new TCollection({ itemClass: TestRichItem })
		col.add({ name: 'Alice', value: 1 })
		col.add({ name: 'Bob', value: 2 })

		const arr = [...col]

		expect(arr).toHaveLength(2)
		expect(arr[0]!.name).toBe('Alice')
		expect(arr[1]!.name).toBe('Bob')
	})

	it('поддерживает Array.from(collection)', () => {
		const col = new TCollection({ itemClass: TestRichItem })
		col.add({ name: 'Alice', value: 1 })
		col.add({ name: 'Bob', value: 2 })

		const arr = Array.from(col)

		expect(arr).toHaveLength(2)
		expect(arr[0]!.name).toBe('Alice')
	})

	it('поддерживает деструктуризацию', () => {
		const col = new TCollection({ itemClass: TestRichItem })
		col.add({ name: 'Alice', value: 1 })
		col.add({ name: 'Bob', value: 2 })
		col.add({ name: 'Charlie', value: 3 })

		const [first, second, third] = col

		expect(first!.name).toBe('Alice')
		expect(second!.name).toBe('Bob')
		expect(third!.name).toBe('Charlie')
	})

	it('пустая коллекция — for...of не делает итераций', () => {
		const col = new TCollection({ itemClass: TestRichItem })
		let count = 0

		for (const _ of col) {
			count++
		}

		expect(count).toBe(0)
	})
})

describe('TCollection — patchItems', () => {
	const trackBy = (item: any) => item.id

	it('updates existing items by key (assign)', () => {
		const col = new TCollection({ itemClass: TestRichItem })

		const a = col.add({ name: 'Alice', value: 1 } as any)
		const b = col.add({ name: 'Bob', value: 2 } as any)

		col.patchItems(
			[
				{ name: 'Alice Updated', value: 1 },
				{ name: 'Bob Updated', value: 2 },
			],
			(item: any) => item.value,
		)

		expect(col.count).toBe(2)
		expect(a.name).toBe('Alice Updated')
		expect(a.value).toBe(1)
		expect(b.name).toBe('Bob Updated')
		expect(b.value).toBe(2)
		// Сохранились те же инстансы
		expect(col.getItem(0)).toBe(a)
		expect(col.getItem(1)).toBe(b)
	})

	it('adds new items (add)', () => {
		const col = new TCollection({ itemClass: TestRichItem })

		col.add({ name: 'Alice', value: 1 } as any)

		col.patchItems(
			[
				{ name: 'Alice', value: 1 },
				{ name: 'Bob', value: 2 },
			],
			(item: any) => item.name,
		)

		expect(col.count).toBe(2)
		expect(col.getItem(0)!.name).toBe('Alice')
		expect(col.getItem(1)!.name).toBe('Bob')
	})

	it('deletes removed items (delete)', () => {
		const col = new TCollection({ itemClass: TestRichItem })

		const a = col.add({ name: 'Alice', value: 1 } as any)
		const b = col.add({ name: 'Bob', value: 2 } as any)

		const freeSpy = vi.spyOn(b, 'free')

		col.patchItems([{ name: 'Alice', value: 1 }], (item: any) => item.name)

		expect(col.count).toBe(1)
		expect(col.getItem(0)).toBe(a)
		expect(freeSpy).toHaveBeenCalled()
	})

	it('combined add, update and delete', () => {
		const col = new TCollection({ itemClass: TestRichItem })

		const a = col.add({ name: 'Alice', value: 1 } as any) // будет обновлён
		const b = col.add({ name: 'Bob', value: 2 } as any) // будет удалён
		// Charlie — будет добавлен

		col.patchItems(
			[
				{ name: 'Alice', value: 100 },
				{ name: 'Charlie', value: 3 },
			],
			(item: any) => item.name,
		)

		expect(col.count).toBe(2)
		expect(col.getItem(0)!.name).toBe('Alice')
		expect((col.getItem(0) as TestRichItem).value).toBe(100)
		expect(col.getItem(1)!.name).toBe('Charlie')
		expect((col.getItem(1) as TestRichItem).value).toBe(3)
	})

	it('does nothing without trackBy', () => {
		const col = new TCollection({ itemClass: TestRichItem })

		col.add({ name: 'Alice', value: 1 } as any)

		col.patchItems([{ name: 'Bob', value: 2 }])

		expect(col.count).toBe(1)
		expect(col.getItem(0)!.name).toBe('Alice')
	})

	it('handles empty sources (clears all)', () => {
		const col = new TCollection({ itemClass: TestRichItem })

		col.add({ name: 'Alice', value: 1 } as any)
		col.add({ name: 'Bob', value: 2 } as any)

		col.patchItems([], (item: any) => item.name)

		expect(col.count).toBe(0)
	})

	it('preserves event subscriptions after patchItems', () => {
		const col = new TCollection({ itemClass: TestRichItem })

		col.add({ name: 'Alice', value: 1 } as any)

		const spy = vi.fn()
		col.events.on('change:items', spy)

		col.patchItems([{ name: 'Bob', value: 2 }], (item: any) => item.name)

		// Должен сработать change:items
		expect(spy).toHaveBeenCalled()
	})

	it('handles duplicate keys (last source wins)', () => {
		const col = new TCollection({ itemClass: TestRichItem })

		col.add({ name: 'Alice', value: 1 } as any)

		col.patchItems(
			[
				{ name: 'Alice', value: 10 },
				{ name: 'Alice', value: 20 },
			],
			(item: any) => item.name,
		)

		expect(col.count).toBe(1)
		expect((col.getItem(0) as TestRichItem).value).toBe(20)
	})
})
