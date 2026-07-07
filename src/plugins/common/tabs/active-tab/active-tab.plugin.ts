import type { ITabs } from '@core'
import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TInstancePlugin } from '../../instance'
import { TTabsLayoutPlugin } from '../layout'
import { TElementAccumulationPlugin } from '../../collection'
import type { TActiveTabOffset, TTabsActiveTabPluginEvents } from './types'

export class TTabsActiveTabPlugin extends TBasePlugin<TTabsActiveTabPluginEvents> {
	static readonly key = 'tabs-active-tab'

	private _element: HTMLElement | null = null
	private _tabs: ITabs | null = null
	private _collectionElements: TElementAccumulationPlugin | null = null

	override install(bundle: IPluginBundle): void {
		bundle.get(TElementPlugin)?.events.on('ready', ({ element }) => {
			this._element = element
			this._emitOffset()
		})

		bundle.get(TElementPlugin)?.events.on('removed', () => {
			this._element = null
		})

		bundle.get(TTabsLayoutPlugin)?.events.on('layout:change', () => this._emitOffset())

		this._collectionElements = bundle.get(TElementAccumulationPlugin) ?? null

		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<ITabs> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._tabs = instance

			instance.events.on('item:activated', () => this._emitOffset())
			instance.events.on('item:afterDelete', () => requestAnimationFrame(() => this._emitOffset()))
			instance.events.on('item:afterMove', () => requestAnimationFrame(() => this._emitOffset()))
			instance.events.on('item:deactivated', () => this._emitOffset())
			instance.events.on('change:view', () => this._emitOffset())
		})
	}

	override destroy(): void {
		this._element = null
		this._tabs = null
		this._collectionElements = null

		super.destroy()
	}

	getOffset(): TActiveTabOffset | null {
		return this._computeOffset()
	}

	private _emitOffset(): void {
		this.events.emit('active-tab:change', this._computeOffset())
	}

	private _computeOffset(): TActiveTabOffset | null {
		if (!this._element || !this._collectionElements) return null

		const listCls = this._tabs!.classes.resolve(`__list`, { point: true })!
		const listEl = this._element.querySelector(listCls) as HTMLElement | null

		if (!listEl) return null

		const activeItem = this._tabs!.activeItem
		const activeEl = activeItem ? this._collectionElements.getByUid(activeItem.uid) : null

		return {
			listEl,
			offsetLeft: activeEl ? activeEl.offsetLeft : 0,
			offsetWidth: activeEl ? activeEl.offsetWidth : 0,
			offsetTop: activeEl ? activeEl.offsetTop : 0,
			offsetHeight: activeEl ? activeEl.offsetHeight : 0,
		}
	}
}
