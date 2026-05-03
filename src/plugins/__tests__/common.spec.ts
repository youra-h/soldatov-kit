import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TPluginContainer } from '../base/container'
import { TElementPlugin } from '../common/element'
import { TInstancePlugin } from '../common/instance'

describe('TElementPlugin', () => {
	let container: TPluginContainer
	let plugin: TElementPlugin

	beforeEach(() => {
		container = new TPluginContainer()
		plugin = container.use(TElementPlugin)
	})

	it('element is null initially', () => {
		expect(plugin.element).toBeNull()
	})

	it('emits ready after rAF when element is set', async () => {
		const spy = vi.fn()
		plugin.events.on('ready', spy)

		const el = document.createElement('div')
		plugin.element = el

		await new Promise(resolve => requestAnimationFrame(resolve))

		expect(spy).toHaveBeenCalledOnce()
		expect(spy).toHaveBeenCalledWith({ element: el })
		expect(plugin.element).toBe(el)
	})

	it('emits removed when element is set to null', async () => {
		const el = document.createElement('div')
		plugin.element = el
		await new Promise(resolve => requestAnimationFrame(resolve))

		const spy = vi.fn()
		plugin.events.on('removed', spy)

		plugin.element = null

		expect(spy).toHaveBeenCalledOnce()
		expect(plugin.element).toBeNull()
	})

	it('does not emit if same element set twice', async () => {
		const el = document.createElement('div')
		plugin.element = el
		await new Promise(resolve => requestAnimationFrame(resolve))

		const spy = vi.fn()
		plugin.events.on('ready', spy)

		plugin.element = el

		await new Promise(resolve => requestAnimationFrame(resolve))

		expect(spy).not.toHaveBeenCalled()
	})

	it('getContext() returns current element', async () => {
		const el = document.createElement('div')
		plugin.element = el
		await new Promise(resolve => requestAnimationFrame(resolve))

		expect(plugin.getContext()).toEqual({ element: el })
	})
})

describe('TInstancePlugin', () => {
	let container: TPluginContainer
	let plugin: TInstancePlugin

	beforeEach(() => {
		container = new TPluginContainer()
		plugin = container.use(TInstancePlugin)
	})

	it('instance is null initially', () => {
		expect(plugin.instance).toBeNull()
	})

	it('emits ready when instance is set', () => {
		const spy = vi.fn()
		plugin.events.on('ready', spy)

		const instance = {} as any
		plugin.instance = instance

		expect(spy).toHaveBeenCalledOnce()
		expect(spy).toHaveBeenCalledWith({ instance })
		expect(plugin.instance).toBe(instance)
	})

	it('emits removed when instance set to null', () => {
		const spy = vi.fn()
		plugin.instance = {} as any
		plugin.events.on('removed', spy)

		plugin.instance = null

		expect(spy).toHaveBeenCalledOnce()
		expect(plugin.instance).toBeNull()
	})

	it('does not emit if same instance set twice', () => {
		const instance = {} as any
		plugin.instance = instance

		const spy = vi.fn()
		plugin.events.on('ready', spy)
		plugin.instance = instance

		expect(spy).not.toHaveBeenCalled()
	})

	it('getContext() returns current instance', () => {
		const instance = {} as any
		plugin.instance = instance
		expect(plugin.getContext()).toEqual({ instance })
	})
})
