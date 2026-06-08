import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TCollapse } from '../components/collapse/collapse.class'
import TCollapseItemCustom from '../components/collapse/collapse-item/collapse-item-custom.class'
import TCollapseItem from '../components/collapse/collapse-item/collapse-item.class'
import { TSelectableCollection } from '../base/collection'

describe('TCollapseItemCustom', () => {
	let item: TCollapseItemCustom

	beforeEach(() => {
		item = new TCollapseItemCustom()
	})

	describe('initialization', () => {
		it('creates item with default values', () => {
			expect(item.text).toBe('')
			expect(item.value).toBe('')
			expect(item.tag).toBe('button')
			expect(item.variant).toBe('normal')
			expect(item.arrowPlacement).toBe('end')
		})

		it('creates item with custom props', () => {
			const customItem = new TCollapseItemCustom({
				props: {
					text: 'Section 1',
					value: 'section1',
				},
			})

			expect(customItem.text).toBe('Section 1')
			expect(customItem.value).toBe('section1')
		})
	})

	describe('property setters', () => {
		it('emits change:text when text changes', () => {
			const spy = vi.fn()
			item.events.on('change:text', spy)

			item.text = 'New Text'

			expect(spy).toHaveBeenCalledWith({ newValue: 'New Text', oldValue: '' })
			expect(item.text).toBe('New Text')
		})
	})

	describe('arrowPlacement', () => {
		it('defaults to end', () => {
			expect(item.arrowPlacement).toBe('end')
		})

		it('can be set to start', () => {
			item.arrowPlacement = 'start'

			expect(item.arrowPlacement).toBe('start')
		})

		it('emits change:arrowPlacement when changed', () => {
			const spy = vi.fn()
			item.events.on('change:arrowPlacement', spy)

			item.arrowPlacement = 'start'

			expect(spy).toHaveBeenCalledWith('start')
		})

		it('does not add --arrow-end class (end is default, no modifier)', () => {
			expect(item.classes.toArray()).not.toContain('s-collapse-item--arrow-end')
		})

		it('removes --arrow-start class when switching back to end', () => {
			item.arrowPlacement = 'start'
			item.arrowPlacement = 'end'

			expect(item.classes.toArray()).not.toContain('s-collapse-item--arrow-start')
			expect(item.classes.toArray()).not.toContain('s-collapse-item--arrow-end')
		})
	})

	describe('appearance', () => {
		it('returns plain when no resolver is set', () => {
			expect(item.appearance).toBe('plain')
		})

		it('returns value from resolver when set', () => {
			item.setAppearanceResolver(() => 'outlined')

			expect(item.appearance).toBe('outlined')
		})

		it('reflects dynamic changes via resolver closure', () => {
			let current: string = 'plain'
			item.setAppearanceResolver(() => current as 'plain')

			expect(item.appearance).toBe('plain')

			current = 'filled'

			expect(item.appearance).toBe('filled')
		})
	})

	describe('getProps', () => {
		it('returns props including text', () => {
			item.text = 'Section'
			item.value = 'sec1'

			const props = item.getProps()

			expect(props.text).toBe('Section')
			expect(props.value).toBe('sec1')
		})

		it('returns appearance from resolver', () => {
			item.setAppearanceResolver(() => 'filled')

			const props = item.getProps()

			expect(props.appearance).toBe('filled')
		})
	})
})

describe('TCollapseItem', () => {
	let item: TCollapseItem
	let collection: TSelectableCollection<any, any, TCollapseItem>

	beforeEach(() => {
		collection = new TSelectableCollection({ itemClass: TCollapseItem as any, mode: 'multiple' })
	})

	describe('initialization', () => {
		it('creates item without collection', () => {
			item = new TCollapseItem()

			expect(item.text).toBe('')
			expect(item.selected).toBe(false)
			expect(item.collection).toBeNull()
		})

		it('creates item with collection', () => {
			item = new TCollapseItem({ collection })

			expect(item.collection).toBe(collection)
		})
	})

	describe('selected property', () => {
		beforeEach(() => {
			item = collection.add({ text: 'Section 1' })
		})

		it('can set and get selected state', () => {
			item.selected = true

			expect(item.selected).toBe(true)
			expect(collection.selected).toContain(item)
		})

		it('toggleSelected switches selected state', () => {
			item.selected = true
			item.toggleSelected()

			expect(item.selected).toBe(false)
		})

		it('emits change:selection event when selected changes', () => {
			const spy = vi.fn()
			item.events.on('change:selection', spy)

			item.selected = true

			expect(spy).toHaveBeenCalledWith(item)
		})
	})

	describe('open / close methods', () => {
		beforeEach(() => {
			item = collection.add({ text: 'Section 1' })
		})

		it('open() sets selected to true', () => {
			item.open()

			expect(item.selected).toBe(true)
		})

		it('close() sets selected to false', () => {
			item.open()
			item.close()

			expect(item.selected).toBe(false)
		})
	})

	describe('CSS classes', () => {
		beforeEach(() => {
			item = collection.add({})
		})

		it('adds --open class when selected', () => {
			item.selected = true

			expect(item.classes.toArray()).toContain('s-collapse-item--open')
		})

		it('removes --open class when deselected', () => {
			item.selected = true
			item.selected = false

			expect(item.classes.toArray()).not.toContain('s-collapse-item--open')
		})
	})

	describe('disabled blocks selection', () => {
		beforeEach(() => {
			item = collection.add({})
		})

		it('does not open when disabled', () => {
			item.disabled = true
			item.open()

			expect(item.selected).toBe(false)
		})
	})

	describe('collection integration', () => {
		it('can be added to collection', () => {
			const item1 = collection.add({ text: 'Section 1' })
			const item2 = collection.add({ text: 'Section 2' })

			expect(collection.count).toBe(2)
			expect(item1.collection).toBe(collection)
			expect(item2.collection).toBe(collection)
		})

		it('multiple items can be selected in multiple mode', () => {
			const item1 = collection.add({ text: 'Section 1' })
			const item2 = collection.add({ text: 'Section 2' })

			item1.selected = true
			item2.selected = true

			expect(collection.selected).toContain(item1)
			expect(collection.selected).toContain(item2)
			expect(collection.selectedCount).toBe(2)
		})

		it('only one item selected in single mode', () => {
			collection.mode = 'single'
			const item1 = collection.add({ text: 'Section 1' })
			const item2 = collection.add({ text: 'Section 2' })

			item1.selected = true
			item2.selected = true

			expect(item1.selected).toBe(false)
			expect(item2.selected).toBe(true)
			expect(collection.selectedCount).toBe(1)
		})
	})

	describe('composition with TCollapseItemCustom', () => {
		beforeEach(() => {
			item = collection.add({ text: 'My Section', value: 'sec1' })
		})

		it('has all UI properties from TCollapseItemCustom', () => {
			expect(item.text).toBe('My Section')
			expect(item.value).toBe('sec1')
		})

		it('emits UI events from TCollapseItemCustom', () => {
			const textSpy = vi.fn()
			item.events.on('change:text', textSpy)

			item.text = 'Updated'

			expect(textSpy).toHaveBeenCalledWith({ newValue: 'Updated', oldValue: 'My Section' })
		})

		it('has appearance from TCollapseItemCustom', () => {
			item.setAppearanceResolver(() => 'filled')

			expect(item.appearance).toBe('filled')
		})
	})

	describe('getProps', () => {
		it('returns props including selected and UI properties', () => {
			item = collection.add({ text: 'Section', value: 'sec1' })
			item.selected = true

			const props = item.getProps()

			expect(props.text).toBe('Section')
			expect(props.value).toBe('sec1')
			expect(props.selected).toBe(true)
		})
	})

	describe('assign', () => {
		it('assigns properties including selected', () => {
			item = collection.add({})
			item.assign({ text: 'Assigned', value: 'a1', selected: true })

			expect(item.text).toBe('Assigned')
			expect(item.value).toBe('a1')
			expect(item.selected).toBe(true)
		})
	})

	describe('free', () => {
		it('emits free event when free is called', () => {
			item = collection.add({})
			const spy = vi.fn()
			item.events.on('free', spy)

			item.free()

			expect(spy).toHaveBeenCalledWith(item)
		})
	})
})

describe('TCollapse', () => {
	let collapse: TCollapse

	beforeEach(() => {
		collapse = new TCollapse()
	})

	describe('initialization', () => {
		it('creates with default values', () => {
			expect(collapse.appearance).toBe('plain')
			expect(collapse.mode).toBe('multiple')
			expect(collapse.selectedCount).toBe(0)
			expect(collapse.selected).toEqual([])
		})

		it('creates with custom props', () => {
			const custom = new TCollapse({
				props: { appearance: 'outlined', mode: 'single' },
			})

			expect(custom.appearance).toBe('outlined')
			expect(custom.mode).toBe('single')
		})
	})

	describe('appearance', () => {
		it('sets appearance and emits event', () => {
			const spy = vi.fn()
			collapse.events.on('change:appearance', spy)

			collapse.appearance = 'filled'

			expect(collapse.appearance).toBe('filled')
			expect(spy).toHaveBeenCalledWith('filled')
		})

		it('applies CSS class for appearance', () => {
			collapse.appearance = 'outlined'

			expect(collapse.classes.toArray()).toContain('s-collapse--outlined')
			expect(collapse.classes.toArray()).not.toContain('s-collapse--plain')
		})

		it('does not emit event when appearance does not change', () => {
			const spy = vi.fn()
			collapse.events.on('change:appearance', spy)

			collapse.appearance = 'plain'

			expect(spy).not.toHaveBeenCalled()
		})

		it('propagates appearance to item via resolver when item is added', () => {
			collapse.appearance = 'outlined'
			const item = collapse.collection.add({})

			expect(item.appearance).toBe('outlined')
		})

		it('updates item appearance when collapse appearance changes', () => {
			collapse.appearance = 'outlined'
			const item = collapse.collection.add({})

			collapse.appearance = 'filled'

			expect(item.appearance).toBe('filled')
		})

		it('emits change:appearance on each item when collapse appearance changes', () => {
			const item1 = collapse.collection.add({})
			const item2 = collapse.collection.add({})
			const spy1 = vi.fn()
			const spy2 = vi.fn()

			item1.events.on('change:appearance', spy1)
			item2.events.on('change:appearance', spy2)

			collapse.appearance = 'filled'

			expect(spy1).toHaveBeenCalledWith('filled')
			expect(spy2).toHaveBeenCalledWith('filled')
		})

		it('new items get current appearance via resolver', () => {
			collapse.appearance = 'filled'
			const item1 = collapse.collection.add({})

			collapse.appearance = 'outlined'
			const item2 = collapse.collection.add({})

			expect(item1.appearance).toBe('outlined')
			expect(item2.appearance).toBe('outlined')
		})
	})

	describe('mode', () => {
		it('can change mode', () => {
			collapse.mode = 'single'

			expect(collapse.mode).toBe('single')
		})
	})

	describe('collection access', () => {
		it('provides access to collection', () => {
			expect(collapse.collection).toBeDefined()
			expect(collapse.collection.count).toBe(0)
		})

		it('can add items through collection', () => {
			const item = collapse.collection.add({ text: 'Section 1' })

			expect(collapse.collection.count).toBe(1)
			expect(item).toBeInstanceOf(TCollapseItem)
			expect(item.text).toBe('Section 1')
		})

		it('emits item:added when item is added', () => {
			const spy = vi.fn()
			collapse.events.on('item:added', spy)

			const item = collapse.collection.add({ text: 'Section 1' })

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({ collection: collapse.collection, item }),
			)
		})

		it('emits item:deleted when item is deleted', () => {
			const item = collapse.collection.add({ text: 'Section 1' })
			const spy = vi.fn()
			collapse.events.on('item:deleted', spy)

			collapse.collection.deleteItem(item)

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({ collection: collapse.collection, item }),
			)
			expect(collapse.collection.count).toBe(0)
		})
	})

	describe('selection events proxy', () => {
		it('emits item:selected when item is selected', () => {
			const item = collapse.collection.add({ text: 'Section 1' })
			const spy = vi.fn()
			collapse.events.on('item:selected', spy)

			item.selected = true

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({ item }),
			)
		})

		it('emits item:unselected when item is deselected', () => {
			const item = collapse.collection.add({ text: 'Section 1' })
			item.selected = true

			const spy = vi.fn()
			collapse.events.on('item:unselected', spy)

			item.selected = false

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({ item }),
			)
		})

		it('emits change:selected when selection changes', () => {
			const item = collapse.collection.add({ text: 'Section 1' })
			const spy = vi.fn()
			collapse.events.on('change:selected', spy)

			item.selected = true

			expect(spy).toHaveBeenCalledWith([item])
		})
	})

	describe('selected / selectedCount', () => {
		it('returns selected items', () => {
			const item1 = collapse.collection.add({ text: 'Section 1' })
			const item2 = collapse.collection.add({ text: 'Section 2' })

			item1.selected = true

			expect(collapse.selected).toContain(item1)
			expect(collapse.selected).not.toContain(item2)
			expect(collapse.selectedCount).toBe(1)
		})

		it('multiple mode allows multiple open items', () => {
			const item1 = collapse.collection.add({})
			const item2 = collapse.collection.add({})

			item1.selected = true
			item2.selected = true

			expect(collapse.selectedCount).toBe(2)
		})

		it('single mode closes previous when new opens', () => {
			collapse.mode = 'single'
			const item1 = collapse.collection.add({})
			const item2 = collapse.collection.add({})

			item1.selected = true
			item2.selected = true

			expect(item1.selected).toBe(false)
			expect(item2.selected).toBe(true)
			expect(collapse.selectedCount).toBe(1)
		})
	})

	describe('disabled propagation', () => {
		it('disables all items when collapse is disabled', () => {
			const item1 = collapse.collection.add({})
			const item2 = collapse.collection.add({})

			collapse.disabled = true

			expect(item1.disabled).toBe(true)
			expect(item2.disabled).toBe(true)
		})
	})

	describe('getProps', () => {
		it('returns all props', () => {
			const props = collapse.getProps()

			expect(props.appearance).toBe('plain')
			expect(props.mode).toBe('multiple')
		})
	})
})
