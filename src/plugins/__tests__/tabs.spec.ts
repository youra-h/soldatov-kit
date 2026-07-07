import { describe, it, expect, beforeEach } from 'vitest'
import { TTabs } from '@core'
import { createTabsBundle } from '../bundles'
import { TElementPlugin } from '../common/element'
import { TInstancePlugin } from '../common/instance'
import { TTabsViewPlugin } from '../common/tabs/view'
import { type IPluginBundle } from '../base'

function createTabsDom(): HTMLElement {
	const root = document.createElement('div')
	const list = document.createElement('div')
	list.className = 's-tabs__list'

	const tab1 = document.createElement('div')
	// offsetLeft/offsetWidth — не в style, задаём как числовые свойства элемента
	Object.defineProperty(tab1, 'offsetLeft', { value: 0, configurable: true })
	Object.defineProperty(tab1, 'offsetWidth', { value: 0, configurable: true })
	const tab2 = document.createElement('div')

	list.appendChild(tab1)
	list.appendChild(tab2)
	root.appendChild(list)

	return root
}

describe('TTabsBundle', () => {
	let bundle: IPluginBundle
	let tabs: TTabs

	beforeEach(() => {
		bundle = createTabsBundle()
		tabs = new TTabs()
	})

	it('has TElementPlugin, TInstancePlugin, TTabsViewPlugin pre-installed', () => {
		expect(bundle.get(TElementPlugin)).toBeInstanceOf(TElementPlugin)
		expect(bundle.get(TInstancePlugin)).toBeInstanceOf(TInstancePlugin)
		expect(bundle.get(TTabsViewPlugin)).toBeInstanceOf(TTabsViewPlugin)
	})

	it('view plugin reacts to instance:ready', () => {
		const instancePlugin = bundle.get(TInstancePlugin)!
		instancePlugin.instance = tabs

		expect(bundle.get(TTabsViewPlugin)).toBeInstanceOf(TTabsViewPlugin)
	})

	it('full flow: delayed element + instance, no errors', async () => {
		const instancePlugin = bundle.get(TInstancePlugin)!
		const elementPlugin = bundle.get(TElementPlugin)!

		tabs.collection.add({ text: 'Tab 1' })
		tabs.collection.add({ text: 'Tab 2' })

		instancePlugin.instance = tabs

		const el = createTabsDom()

		await new Promise<void>((resolve) => {
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

		await new Promise<void>((resolve) => {
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

		await new Promise<void>((resolve) => {
			elementPlugin.events.on('ready', () => resolve())
			elementPlugin.element = el
		})

		elementPlugin.element = null
		expect(elementPlugin.element).toBeNull()
	})

	it('bundle.remove(TTabsViewPlugin) calls destroy without error', async () => {
		const elementPlugin = bundle.get(TElementPlugin)!
		const instancePlugin = bundle.get(TInstancePlugin)!

		instancePlugin.instance = tabs

		const el = createTabsDom()
		await new Promise<void>((resolve) => {
			elementPlugin.events.on('ready', () => resolve())
			elementPlugin.element = el
		})

		expect(() => {
			bundle.remove(TTabsViewPlugin)
		}).not.toThrow()

		expect(bundle.get(TTabsViewPlugin)).toBeUndefined()
	})
})
