import { describe, it, expect, beforeEach, vi } from 'vitest'
import TTabItem from '../components/tabs/tab-item/tab-item.class'
import TTabItemCustom from '../components/tabs/tab-item/tab-item-custom.class'
import { TActivatableCollection } from '../base/collection'

describe('TTabItemCustom', () => {
	let item: TTabItemCustom

	beforeEach(() => {
		item = new TTabItemCustom()
	})

	describe('initialization', () => {
		it('creates tab item with default values', () => {
			expect(item.text).toBe('')
			expect(item.value).toBeUndefined()
			expect(item.closable).toBeUndefined()
		})

		it('creates tab item with custom props', () => {
			const customItem = new TTabItemCustom({
				props: {
					text: 'My Tab',
					value: 'tab1',
					closable: true,
				},
			})

			expect(customItem.text).toBe('My Tab')
			expect(customItem.value).toBe('tab1')
			expect(customItem.closable).toBe(true)
		})
	})

	describe('property setters', () => {
		it('emits change:text when text changes', () => {
			const spy = vi.fn()
			item.events.on('change:text', spy)

			item.text = 'New Text'

			expect(spy).toHaveBeenCalledWith('New Text')
			expect(item.text).toBe('New Text')
		})

		it('emits change:closable when closable changes', () => {
			const spy = vi.fn()
			item.events.on('change:closable', spy)

			item.closable = true

			expect(spy).toHaveBeenCalledWith(true)
			expect(item.closable).toBe(true)
		})

		it('can set closable to undefined', () => {
			item.closable = true
			item.closable = undefined

			expect(item.closable).toBeUndefined()
		})
	})

	describe('close method', () => {
		it('emits close event when close is called', () => {
			const spy = vi.fn()
			item.events.on('close', spy)

			item.close()

			expect(spy).toHaveBeenCalled()
		})
	})

	describe('classes generation', () => {
		it('includes closable class when closable is true', () => {
			item.closable = true

			const classes = item.classes

			expect(classes).toContain('s-tab-item--closable')
		})

		it('does not include closable class when closable is false/undefined', () => {
			item.closable = false

			const classes = item.classes

			expect(classes).not.toContain('s-tab-item--closable')
		})
	})

	describe('getProps', () => {
		it('returns all props including text and closable', () => {
			item.text = 'Tab Text'
			item.closable = true
			item.value = 'tab1'

			const props = item.getProps()

			expect(props.text).toBe('Tab Text')
			expect(props.closable).toBe(true)
			expect(props.value).toBe('tab1')
		})
	})
})

describe('TTabItem', () => {
	let item: TTabItem
	let collection: TActivatableCollection<any, any, TTabItem>

	beforeEach(() => {
		collection = new TActivatableCollection({ itemClass: TTabItem as any })
	})

	describe('initialization', () => {
		it('creates tab item without collection', () => {
			item = new TTabItem()

			expect(item.text).toBe('')
			expect(item.active).toBe(false)
			expect(item.collection).toBeNull()
		})

		it('creates tab item with collection', () => {
			item = new TTabItem(collection)

			expect(item.collection).toBe(collection)
		})
	})

	describe('active property', () => {
		beforeEach(() => {
			item = collection.add({ text: 'Tab 1' })
		})

		it('can set and get active state', () => {
			item.active = true

			expect(item.active).toBe(true)
			expect(collection.activeItem).toBe(item)
		})

		it('toggleActive switches active state', () => {
			item.active = true

			item.toggleActive()

			expect(item.active).toBe(false)
			expect(collection.activeItem).toBeUndefined()
		})

		it('emits change event when active changes', () => {
			const spy = vi.fn()
			item.events.on('change', spy)

			item.active = true

			expect(spy).toHaveBeenCalledWith(item)
		})
	})

	describe('collection integration', () => {
		it('can be added to collection', () => {
			const item1 = collection.add({ text: 'Tab 1' })
			const item2 = collection.add({ text: 'Tab 2' })

			expect(collection.count).toBe(2)
			expect(item1.collection).toBe(collection)
			expect(item2.collection).toBe(collection)
		})

		it('can be removed from collection', () => {
			const item1 = collection.add({ text: 'Tab 1' })
			const item2 = collection.add({ text: 'Tab 2' })

			collection.deleteItem(item1)

			expect(collection.count).toBe(1)
		})

		it('activates in collection when active is set', () => {
			const item1 = collection.add({ text: 'Tab 1' })
			const item2 = collection.add({ text: 'Tab 2' })

			item1.active = true

			expect(collection.activeItem).toBe(item1)

			item2.active = true

			expect(collection.activeItem).toBe(item2)
			expect(item1.active).toBe(false)
		})
	})

	describe('composition with TTabItemCustom', () => {
		beforeEach(() => {
			item = collection.add({
				text: 'My Tab',
				value: 'tab1',
				closable: true,
			})
		})

		it('has all UI properties from TTabItemCustom', () => {
			expect(item.text).toBe('My Tab')
			expect(item.value).toBe('tab1')
			expect(item.closable).toBe(true)
		})

		it('emits UI events from TTabItemCustom', () => {
			const textSpy = vi.fn()
			const closableSpy = vi.fn()

			item.events.on('change:text', textSpy)
			item.events.on('change:closable', closableSpy)

			item.text = 'New Text'
			item.closable = false

			expect(textSpy).toHaveBeenCalledWith('New Text')
			expect(closableSpy).toHaveBeenCalledWith(false)
		})

		it('can call close method', () => {
			const spy = vi.fn()
			item.events.on('close', spy)

			item.close()

			expect(spy).toHaveBeenCalled()
		})
	})

	describe('getProps', () => {
		beforeEach(() => {
			item = collection.add({
				text: 'Tab Text',
				value: 'tab1',
				closable: true,
			})
		})

		it('returns props including active and UI properties', () => {
			item.active = true

			const props = item.getProps()

			expect(props.text).toBe('Tab Text')
			expect(props.value).toBe('tab1')
			expect(props.closable).toBe(true)
			expect(props.active).toBe(true)
		})
	})

	describe('assign', () => {
		beforeEach(() => {
			item = collection.add({})
		})

		it('assigns all properties including active', () => {
			item.assign({
				text: 'Assigned Tab',
				value: 'assigned',
				closable: true,
				active: true,
			})

			expect(item.text).toBe('Assigned Tab')
			expect(item.value).toBe('assigned')
			expect(item.closable).toBe(true)
			expect(item.active).toBe(true)
		})
	})

	describe('free', () => {
		beforeEach(() => {
			item = collection.add({})
		})

		it('emits free event when free is called', () => {
			const spy = vi.fn()
			item.events.on('free', spy)

			item.free()

			expect(spy).toHaveBeenCalledWith(item)
		})
	})
})
