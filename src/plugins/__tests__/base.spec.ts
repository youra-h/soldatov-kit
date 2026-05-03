import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TBasePlugin } from '../base/plugin'
import { TPluginContainer } from '../base/container'
import type { IPluginContainer } from '../base/types'

// --- helpers ---

type TTestEvents = { ping: () => void }

class TTestPlugin extends TBasePlugin<TTestEvents> {
	static readonly key = 'test'
	installed = false
	destroyed = false

	override install(container: IPluginContainer): void {
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

describe('TPluginContainer', () => {
	let container: TPluginContainer

	beforeEach(() => {
		container = new TPluginContainer()
	})

	it('use() adds plugin and calls install()', () => {
		const plugin = container.use(TTestPlugin)
		expect(plugin).toBeInstanceOf(TTestPlugin)
		expect(plugin.installed).toBe(true)
	})

	it('get() by constructor returns plugin', () => {
		container.use(TTestPlugin)
		expect(container.get(TTestPlugin)).toBeInstanceOf(TTestPlugin)
	})

	it('get() by string key returns plugin', () => {
		container.use(TTestPlugin)
		expect(container.get('test')).toBeInstanceOf(TTestPlugin)
	})

	it('get() returns undefined for missing plugin', () => {
		expect(container.get(TTestPlugin)).toBeUndefined()
	})

	it('remove() calls destroy() and removes plugin', () => {
		const plugin = container.use(TTestPlugin)
		const spy = vi.fn()
		plugin.events.on('destroyed', spy)

		container.remove(TTestPlugin)

		expect(plugin.destroyed).toBe(true)
		expect(spy).toHaveBeenCalledOnce()
		expect(container.get(TTestPlugin)).toBeUndefined()
	})

	it('use() replaces existing plugin with same key', () => {
		const first = container.use(TTestPlugin)
		const second = container.use(TTestPlugin)
		expect(first).not.toBe(second)
		expect(container.get(TTestPlugin)).toBe(second)
	})

	it('multiple plugins coexist', () => {
		container.use(TTestPlugin)
		container.use(TAnotherPlugin)
		expect(container.get(TTestPlugin)).toBeInstanceOf(TTestPlugin)
		expect(container.get(TAnotherPlugin)).toBeInstanceOf(TAnotherPlugin)
	})
})
