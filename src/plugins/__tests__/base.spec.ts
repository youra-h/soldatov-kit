import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TBasePlugin } from '../base/plugin'
import { TPluginBundle } from '../base/bundle'
import type { IPluginBundle } from '../base/types'

// --- helpers ---

type TTestEvents = { ping: () => void }

class TTestPlugin extends TBasePlugin<TTestEvents> {
	static readonly key = 'test'
	installed = false
	destroyed = false

	override install(bundle: IPluginBundle): void {
		this.installed = true
	}

	override destroy(): void {
		this.destroyed = true
		super.destroy()
	}
}

class TAnotherPlugin extends TBasePlugin {
	static readonly key = 'another'
}

// --- tests ---

describe('TBasePlugin', () => {
	it('key getter returns static key', () => {
		const plugin = new TTestPlugin()
		expect(plugin.key).toBe('test')
	})

	it('has events instance', () => {
		const plugin = new TTestPlugin()
		expect(plugin.events).toBeDefined()
	})

	it('emits destroyed event on destroy()', () => {
		const plugin = new TTestPlugin()
		const spy = vi.fn()
		plugin.events.on('destroyed', spy)
		plugin.destroy()
		expect(spy).toHaveBeenCalledOnce()
	})
})

describe('TPluginBundle', () => {
	let bundle: TPluginBundle

	beforeEach(() => {
		bundle = new TPluginBundle()
	})

	it('use() adds plugin and calls install()', () => {
		const plugin = bundle.use(TTestPlugin).get(TTestPlugin)!

		expect(plugin).toBeInstanceOf(TTestPlugin)
		expect(plugin.installed).toBe(true)
	})

	it('get() by constructor returns plugin', () => {
		bundle.use(TTestPlugin)
		expect(bundle.get(TTestPlugin)).toBeInstanceOf(TTestPlugin)
	})

	it('get() by string key returns plugin', () => {
		bundle.use(TTestPlugin)
		expect(bundle.get('test')).toBeInstanceOf(TTestPlugin)
	})

	it('get() returns undefined for missing plugin', () => {
		expect(bundle.get(TTestPlugin)).toBeUndefined()
	})

	it('remove() calls destroy() and removes plugin', () => {
		const plugin = bundle.use(TTestPlugin).get(TTestPlugin)!
		const spy = vi.fn()
		plugin.events.on('destroyed', spy)

		bundle.remove(TTestPlugin)

		expect(plugin.destroyed).toBe(true)
		expect(spy).toHaveBeenCalledOnce()
		expect(bundle.get(TTestPlugin)).toBeUndefined()
	})

	it('use() replaces existing plugin with same key', () => {
		const first = bundle.use(TTestPlugin).get(TTestPlugin)!
		const second = bundle.use(TTestPlugin).get(TTestPlugin)!
		expect(first).not.toBe(second)
		expect(bundle.get(TTestPlugin)).toBe(second)
	})

	it('multiple plugins coexist', () => {
		bundle.use(TTestPlugin)
		bundle.use(TAnotherPlugin)
		expect(bundle.get(TTestPlugin)).toBeInstanceOf(TTestPlugin)
		expect(bundle.get(TAnotherPlugin)).toBeInstanceOf(TAnotherPlugin)
	})
})
