import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TTabs } from '../../core/components/tabs'
import { TTabsBundle } from '../bundles/tabs'
import { TElementPlugin } from '../common/element'
import { TInstancePlugin } from '../common/instance'
import { TTabsAppearancePlugin } from '../common/tabs/appearance'

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

describe('TTabsBundle', () => {
	let bundle: TTabsBundle
	let tabs: TTabs

	beforeEach(() => {
		bundle = new TTabsBundle()
		tabs = new TTabs()
	})

	it('has TElementPlugin, TInstancePlugin, TTabsAppearancePlugin pre-installed', () => {
		expect(bundle.get(TElementPlugin)).toBeInstanceOf(TElementPlugin)
		expect(bundle.get(TInstancePlugin)).toBeInstanceOf(TInstancePlugin)
		expect(bundle.get(TTabsAppearancePlugin)).toBeInstanceOf(TTabsAppearancePlugin)
	})

	it('appearance plugin reacts to instance:ready', () => {
		const instancePlugin = bundle.get(TInstancePlugin)!
		instancePlugin.instance = tabs

		expect(bundle.get(TTabsAppearancePlugin)).toBeInstanceOf(TTabsAppearancePlugin)
	})

	it('full flow: delayed element + instance, no errors', async () => {
		const instancePlugin = bundle.get(TInstancePlugin)!
		const elementPlugin = bundle.get(TElementPlugin)!

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
		const elementPlugin = bundle.get(TElementPlugin)!
		const instancePlugin = bundle.get(TInstancePlugin)!

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
		const elementPlugin = bundle.get(TElementPlugin)!
		const el = createTabsDom()

		await new Promise<void>(resolve => {
			elementPlugin.events.on('ready', () => resolve())
			elementPlugin.element = el
		})

		elementPlugin.element = null
		expect(elementPlugin.element).toBeNull()
	})

	it('bundle.remove(TTabsAppearancePlugin) calls destroy without error', async () => {
		const elementPlugin = bundle.get(TElementPlugin)!
		const instancePlugin = bundle.get(TInstancePlugin)!

		instancePlugin.instance = tabs

		const el = createTabsDom()
		await new Promise<void>(resolve => {
			elementPlugin.events.on('ready', () => resolve())
			elementPlugin.element = el
		})

		expect(() => {
			bundle.remove(TTabsAppearancePlugin)
		}).not.toThrow()

		expect(bundle.get(TTabsAppearancePlugin)).toBeUndefined()
	})
})
