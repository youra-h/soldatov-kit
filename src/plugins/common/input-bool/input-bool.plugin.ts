import type { ICheckBox } from '@core'
import { TBasePlugin } from '../../base'
import { TElementPlugin } from '../element'
import { TInstancePlugin } from '../instance'
import type { TInputBoolPluginEvents } from './types'
import type { IPluginBundle } from '../../base/types'

export class TInputBoolPlugin extends TBasePlugin<TInputBoolPluginEvents> {
	static readonly key = 'input-bool'

	private _input: HTMLInputElement | null = null
	private _instance: ICheckBox | null = null
	private _onChange = this._handleChange.bind(this)

	override install(bundle: IPluginBundle): void {
		const elementPlugin = bundle.get(TElementPlugin)

		elementPlugin?.events.on('ready', ({ element }) => {
			const input = element.querySelector<HTMLInputElement>('input')
			if (!input) return

			this._input = input
			input.addEventListener('change', this._onChange)
		})

		elementPlugin?.events.on('removed', () => {
			this._removeInputListener()
			this._input = null
		})

		const instancePlugin = bundle.get(TInstancePlugin)

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._instance = instance as unknown as ICheckBox
		})

		instancePlugin?.events.on('removed', () => {
			this._instance = null
		})
	}

	override destroy(): void {
		this._removeInputListener()
		this._input = null
		this._instance = null

		super.destroy()
	}

	private _handleChange(event: Event): void {
		if (this._instance?.readonly || this._input?.disabled) {
			event.preventDefault()
			return
		}

		this._instance?.toggle()

		this.events.emit('change:value', { value: this._instance?.value })
	}

	private _removeInputListener(): void {
		if (this._input) {
			this._input.removeEventListener('change', this._onChange)
		}
	}
}
