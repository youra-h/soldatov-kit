import { describe, it, expect, beforeEach } from 'vitest'
import { TComponentViewContainer } from '../containers/component-view'
import { TElementPlugin } from '../common/element'
import { TInstancePlugin } from '../common/instance'

describe('TComponentViewContainer', () => {
	let container: TComponentViewContainer

	beforeEach(() => {
		container = new TComponentViewContainer()
	})

	it('has TElementPlugin pre-installed', () => {
		expect(container.get(TElementPlugin)).toBeInstanceOf(TElementPlugin)
	})

	it('has TInstancePlugin pre-installed', () => {
		expect(container.get(TInstancePlugin)).toBeInstanceOf(TInstancePlugin)
	})

	it('element and instance start as null', () => {
		expect(container.get(TElementPlugin)!.element).toBeNull()
		expect(container.get(TInstancePlugin)!.instance).toBeNull()
	})

	it('element plugin reacts after delayed rAF', async () => {
		const plugin = container.get(TElementPlugin)!

		const el = document.createElement('div')

		await new Promise<void>(resolve => {
			plugin.events.on('ready', () => resolve())
			plugin.element = el
		})

		expect(plugin.element).toBe(el)
	})
})
