import { describe, it, expect, beforeEach } from 'vitest'
import { createComponentViewBundle } from '../bundles'
import { TElementPlugin } from '../common/element'
import { TInstancePlugin } from '../common/instance'
import { type IPluginBundle } from '../base'

describe('TComponentViewBundle', () => {
	let bundle: IPluginBundle

	beforeEach(() => {
		bundle = createComponentViewBundle()
	})

	it('has TElementPlugin pre-installed', () => {
		expect(bundle.get(TElementPlugin)).toBeInstanceOf(TElementPlugin)
	})

	it('has TInstancePlugin pre-installed', () => {
		expect(bundle.get(TInstancePlugin)).toBeInstanceOf(TInstancePlugin)
	})

	it('element and instance start as null', () => {
		expect(bundle.get(TElementPlugin)!.element).toBeNull()
		expect(bundle.get(TInstancePlugin)!.instance).toBeNull()
	})

	it('element plugin reacts after delayed rAF', async () => {
		const plugin = bundle.get(TElementPlugin)!

		const el = document.createElement('div')

		await new Promise<void>((resolve) => {
			plugin.events.on('ready', () => resolve())
			plugin.element = el
		})

		expect(plugin.element).toBe(el)
	})
})
