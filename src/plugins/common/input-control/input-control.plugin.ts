import type { IInputControl } from '@core'
import { TBasePlugin } from '../../base'
import { TElementPlugin } from '../element'
import { TInstancePlugin } from '../instance'
import type { TInputControlPluginEvents } from './types'
import type { IPluginBundle } from '../../base/types'

export class TInputControlPlugin extends TBasePlugin<TInputControlPluginEvents> {
	static readonly key = 'input-control'

	private _input: HTMLInputElement | null = null
	private _instance: IInputControl<any> | null = null
	private _onClick = this._handleClick.bind(this)

	override install(bundle: IPluginBundle): void {
		const elementPlugin = bundle.get(TElementPlugin)

		elementPlugin?.events.on('ready', ({ element }) => {
			const input = element.querySelector<HTMLInputElement>('input')
			if (!input) return

			this._input = input
			input.addEventListener('click', this._onClick)
		})

		elementPlugin?.events.on('removed', () => {
			this._removeClickListener()
			this._input = null
		})

		const instancePlugin = bundle.get(TInstancePlugin)

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._instance = instance as unknown as IInputControl<any>
		})

		instancePlugin?.events.on('removed', () => {
			this._instance = null
		})
	}

	override destroy(): void {
		this._removeClickListener()
		this._input = null
		this._instance = null

		super.destroy()
	}

	private _handleClick(event: Event): void {
		if (this._instance?.readonly || this._input?.disabled) {
			event.preventDefault()
		}
	}

	private _removeClickListener(): void {
		if (this._input) {
			this._input.removeEventListener('click', this._onClick)
		}
	}
}
