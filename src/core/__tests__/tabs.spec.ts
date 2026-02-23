import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TTabs } from '../components/tabs'
import TTabItem from '../components/tabs/tab-item/tab-item.class'

describe('TTabs', () => {
	let tabs: TTabs

	beforeEach(() => {
		tabs = new TTabs()
	})

	describe('initialization', () => {
		it('creates tabs with default values', () => {
			expect(tabs.orientation).toBe('horizontal')
			expect(tabs.alignment).toBe('start')
			expect(tabs.position).toBe('start')
			expect(tabs.appearance).toBe('line')
			expect(tabs.stretched).toBe(false)
			expect(tabs.closable).toBe(false)
			expect(tabs.count).toBe(0)
			expect(tabs.activeItem).toBeUndefined()
		})

		it('creates tabs with custom props', () => {
			const customTabs = new TTabs({
				props: {
					orientation: 'vertical',
					alignment: 'center',
					position: 'end',
					appearance: 'pills',
					stretched: true,
					closable: true,
				},
			})

			expect(customTabs.orientation).toBe('vertical')
			expect(customTabs.alignment).toBe('center')
			expect(customTabs.position).toBe('end')
			expect(customTabs.appearance).toBe('pills')
			expect(customTabs.stretched).toBe(true)
			expect(customTabs.closable).toBe(true)
		})
	})

	describe('collection access', () => {
		it('provides access to collection', () => {
			expect(tabs.collection).toBeDefined()
			expect(tabs.count).toBe(0)
		})

		it('can add items through collection', () => {
			const item = tabs.collection.add({ text: 'Tab 1' })

			expect(tabs.count).toBe(1)
			expect(item).toBeInstanceOf(TTabItem)
			expect(item.text).toBe('Tab 1')
		})

		it('emits item:added event when item is added', () => {
			const spy = vi.fn()
			tabs.events.on('item:added', spy)

			const item = tabs.collection.add({ text: 'Tab 1' })

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({ collection: tabs.collection, item }),
			)
		})

		it('emits item:deleted event when item is deleted', () => {
			const item = tabs.collection.add({ text: 'Tab 1' })

			const spy = vi.fn()
			tabs.events.on('item:deleted', spy)

			tabs.collection.deleteItem(item)

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({ collection: tabs.collection, item }),
			)
			expect(tabs.count).toBe(0)
		})

		it('emits item:activated event when item is activated', () => {
			const item1 = tabs.collection.add({ text: 'Tab 1' })
			const item2 = tabs.collection.add({ text: 'Tab 2' })

			const spy = vi.fn()
			tabs.events.on('item:activated', spy)

			tabs.collection.setActive(item1)

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({ collection: tabs.collection, item: item1 }),
			)
			expect(tabs.activeItem).toBe(item1)
		})
	})

	describe('isTabClosable', () => {
		it('returns false when both tabs and item closable are false/undefined', () => {
			const item = tabs.collection.add({})

			expect(tabs.isTabClosable(item)).toBe(false)
		})

		it('returns true when tabs.closable is true and item.closable is undefined', () => {
			tabs.closable = true
			const item = tabs.collection.add({})

			expect(tabs.isTabClosable(item)).toBe(true)
		})

		it('returns item.closable when explicitly set to true', () => {
			tabs.closable = false
			const item = tabs.collection.add({ closable: true })

			expect(tabs.isTabClosable(item)).toBe(true)
		})

		it('returns item.closable when explicitly set to false', () => {
			tabs.closable = true
			const item = tabs.collection.add({ closable: false })

			expect(tabs.isTabClosable(item)).toBe(false)
		})
	})

	describe('closeTab', () => {
		it('returns false when tab is not closable', () => {
			const item = tabs.collection.add({ text: 'Tab 1' })

			const result = tabs.closeTab(item)

			expect(result).toBe(false)
			expect(tabs.count).toBe(1)
		})

		it('emits tab:close event before removing', () => {
			tabs.closable = true
			const item = tabs.collection.add({ text: 'Tab 1' })

			const spy = vi.fn()
			tabs.events.on('tab:close', spy)

			tabs.closeTab(item)

			expect(spy).toHaveBeenCalledWith(item)
		})

		it('removes tab when closable and returns true', () => {
			tabs.closable = true
			const item = tabs.collection.add({ text: 'Tab 1' })

			const result = tabs.closeTab(item)

			expect(result).toBe(true)
			expect(tabs.count).toBe(0)
		})

		it('activates next tab when closing active tab', () => {
			tabs.closable = true
			const item1 = tabs.collection.add({ text: 'Tab 1' })
			const item2 = tabs.collection.add({ text: 'Tab 2' })
			const item3 = tabs.collection.add({ text: 'Tab 3' })

			tabs.collection.setActive(item1)

			tabs.closeTab(item1)

			expect(tabs.activeItem).toBe(item2)
			expect(tabs.count).toBe(2)
		})

		it('activates previous tab when closing last active tab', () => {
			tabs.closable = true
			const item1 = tabs.collection.add({ text: 'Tab 1' })
			const item2 = tabs.collection.add({ text: 'Tab 2' })
			const item3 = tabs.collection.add({ text: 'Tab 3' })

			tabs.collection.setActive(item3)

			tabs.closeTab(item3)

			expect(tabs.activeItem).toBe(item2)
			expect(tabs.count).toBe(2)
		})

		it('clears active when closing the only tab', () => {
			tabs.closable = true
			const item = tabs.collection.add({ text: 'Tab 1' })

			tabs.collection.setActive(item)

			tabs.closeTab(item)

			expect(tabs.activeItem).toBeUndefined()
			expect(tabs.count).toBe(0)
		})

		it('does not change active when closing non-active tab', () => {
			tabs.closable = true
			const item1 = tabs.collection.add({ text: 'Tab 1' })
			const item2 = tabs.collection.add({ text: 'Tab 2' })

			tabs.collection.setActive(item1)

			tabs.closeTab(item2)

			expect(tabs.activeItem).toBe(item1)
			expect(tabs.count).toBe(1)
		})
	})

	describe('property setters', () => {
		it('emits change:orientation when orientation changes', () => {
			const spy = vi.fn()
			tabs.events.on('change:orientation', spy)

			tabs.orientation = 'vertical'

			expect(spy).toHaveBeenCalledWith('vertical')
			expect(tabs.orientation).toBe('vertical')
		})

		it('does not emit when orientation is set to same value', () => {
			const spy = vi.fn()
			tabs.events.on('change:orientation', spy)

			tabs.orientation = 'horizontal'

			expect(spy).not.toHaveBeenCalled()
		})

		it('emits change:alignment when alignment changes', () => {
			const spy = vi.fn()
			tabs.events.on('change:alignment', spy)

			tabs.alignment = 'center'

			expect(spy).toHaveBeenCalledWith('center')
		})

		it('emits change:position when position changes', () => {
			const spy = vi.fn()
			tabs.events.on('change:position', spy)

			tabs.position = 'end'

			expect(spy).toHaveBeenCalledWith('end')
		})

		it('emits change:appearance when appearance changes', () => {
			const spy = vi.fn()
			tabs.events.on('change:appearance', spy)

			tabs.appearance = 'pills'

			expect(spy).toHaveBeenCalledWith('pills')
		})

		it('emits change:stretched when stretched changes', () => {
			const spy = vi.fn()
			tabs.events.on('change:stretched', spy)

			tabs.stretched = true

			expect(spy).toHaveBeenCalledWith(true)
		})

		it('emits change:closable when closable changes', () => {
			const spy = vi.fn()
			tabs.events.on('change:closable', spy)

			tabs.closable = true

			expect(spy).toHaveBeenCalledWith(true)
		})
	})

	describe('classes generation', () => {
		it('generates base class with modifiers', () => {
			tabs.orientation = 'vertical'
			tabs.alignment = 'center'
			tabs.appearance = 'pills'
			tabs.stretched = true

			const classes = tabs.classes

			expect(classes).toContain('s-tabs')
			expect(classes).toContain('s-tabs--vertical')
			expect(classes).toContain('s-tabs--center')
			expect(classes).toContain('s-tabs--pills')
			expect(classes).toContain('s-tabs--stretched')
		})

		it('does not include position class for horizontal orientation', () => {
			tabs.orientation = 'horizontal'
			tabs.position = 'end'

			const classes = tabs.classes

			expect(classes).not.toContain('s-tabs--position-end')
		})

		it('includes position class for vertical orientation', () => {
			tabs.orientation = 'vertical'
			tabs.position = 'end'

			const classes = tabs.classes

			expect(classes).toContain('s-tabs--position-end')
		})
	})

	describe('getProps', () => {
		it('returns all props', () => {
			tabs.orientation = 'vertical'
			tabs.alignment = 'center'
			tabs.closable = true

			const props = tabs.getProps()

			expect(props.orientation).toBe('vertical')
			expect(props.alignment).toBe('center')
			expect(props.closable).toBe(true)
		})
	})
})
