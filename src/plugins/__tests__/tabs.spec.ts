import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TTabs } from '../../core/components/tabs'
import { TTabsContainer } from '../containers/tabs'
import { TElementPlugin } from '../common/element'
import { TInstancePlugin } from '../common/instance'
import { TTabsUnderlinePlugin } from '../containers/tabs/plugins/underline'

function createTabsDom(): HTMLElement {
	const root = document.createElement('div')
	const list = document.createElement('div')
	list.className = 's-tabs__list'

	const tab1 = document.createElement('div')
	tab1.style.offsetLeft = ''
	tab1.style.offsetWidth = ''

	const tab2 = document.createElement('div')

	list.appendChild(tab1)
	list.appendChild(tab2)
	root.appendChild(list)

	return root
}

describe('TTabsContainer', () => {
	let container: TTabsContainer
	let tabs: TTabs

	beforeEach(() => {
		container = new TTabsContainer()
		tabs = new TTabs()
	})

	it('has TElementPlugin, TInstancePlugin, TTabsUnderlinePlugin pre-installed', () => {
		expect(container.get(TElementPlugin)).toBeInstanceOf(TElementPlugin)
		expect(container.get(TInstancePlugin)).toBeInstanceOf(TInstancePlugin)
		expect(container.get(TTabsUnderlinePlugin)).toBeInstanceOf(TTabsUnderlinePlugin)
	})

	it('underline plugin reacts to instance:ready', () => {
		const instancePlugin = container.get(TInstancePlugin)!
		instancePlugin.instance = tabs

		expect(container.get(TTabsUnderlinePlugin)).toBeInstanceOf(TTabsUnderlinePlugin)
	})

	it('full flow: delayed element + instance, no errors', async () => {
		const instancePlugin = container.get(TInstancePlugin)!
		const elementPlugin = container.get(TElementPlugin)!

		tabs.collection.add({ text: 'Tab 1' })
		tabs.collection.add({ text: 'Tab 2' })

		instancePlugin.instance = tabs

		const el = createTabsDom()

		await new Promise<void>(resolve => {
			elementPlugin.events.on('ready', () => resolve())
			elementPlugin.element = el
		})

		expect(elementPlugin.element).toBe(el)
		expect(instancePlugin.instance).toBe(tabs)
	})

	it('underline update runs without error when active tab changes', async () => {
		const elementPlugin = container.get(TElementPlugin)!
		const instancePlugin = container.get(TInstancePlugin)!

		instancePlugin.instance = tabs

		const item1 = tabs.collection.add({ text: 'Tab 1' })
		tabs.collection.add({ text: 'Tab 2' })

		const el = createTabsDom()

		await new Promise<void>(resolve => {
			elementPlugin.events.on('ready', () => resolve())
			elementPlugin.element = el
		})

		expect(() => {
			tabs.collection.setActive(item1)
		}).not.toThrow()
	})

	it('element removed: plugin clears reference', async () => {
		const elementPlugin = container.get(TElementPlugin)!
		const el = createTabsDom()

		await new Promise<void>(resolve => {
			elementPlugin.events.on('ready', () => resolve())
			elementPlugin.element = el
		})

		elementPlugin.element = null
		expect(elementPlugin.element).toBeNull()
	})

	it('container.remove(TTabsUnderlinePlugin) calls destroy without error', async () => {
		const elementPlugin = container.get(TElementPlugin)!
		const instancePlugin = container.get(TInstancePlugin)!

		instancePlugin.instance = tabs

		const el = createTabsDom()
		await new Promise<void>(resolve => {
			elementPlugin.events.on('ready', () => resolve())
			elementPlugin.element = el
		})

		expect(() => {
			container.remove(TTabsUnderlinePlugin)
		}).not.toThrow()

		expect(container.get(TTabsUnderlinePlugin)).toBeUndefined()
	})
})
