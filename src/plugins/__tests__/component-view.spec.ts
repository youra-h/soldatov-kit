import { describe, it, expect, beforeEach } from 'vitest'
import { TComponentViewBundle } from '../bundles/component-view'
import { TElementPlugin } from '../common/element'
import { TInstancePlugin } from '../common/instance'

describe('TComponentViewBundle', () => {
	let bundle: TComponentViewBundle

	beforeEach(() => {
		bundle = new TComponentViewBundle()
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

		await new Promise<void>(resolve => {
			plugin.events.on('ready', () => resolve())
			plugin.element = el
		})

		expect(plugin.element).toBe(el)
	})
})
