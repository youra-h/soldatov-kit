import type { ITextInputControl } from '@core'
import { TBasePlugin } from '../../base'
import { TElementPlugin } from '../element'
import { TInstancePlugin } from '../instance'
import type { TInputPluginEvents } from './types'
import type { IPluginBundle } from '../../base/types'

export class TInputPlugin extends TBasePlugin<TInputPluginEvents> {
	static readonly key = 'input'

	private _input: HTMLInputElement | null = null
	private _instance: ITextInputControl | null = null
	private _onInput = this._handleInput.bind(this)

	override install(bundle: IPluginBundle): void {
		const elementPlugin = bundle.get(TElementPlugin)

		elementPlugin?.events.on('ready', ({ element }) => {
			const input = element.querySelector<HTMLInputElement>('input')
			if (!input) return

			this._input = input
			input.addEventListener('input', this._onInput)
		})

		elementPlugin?.events.on('removed', () => {
			this._removeInputListener()
			this._input = null
		})

		const instancePlugin = bundle.get(TInstancePlugin)

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._instance = instance as unknown as ITextInputControl
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

	private _handleInput(event: Event): void {
		if (!this._instance) return

		if (this._instance.readonly || this._instance.disabled) {
			event.preventDefault()
			return
		}

		const target = event.target as HTMLInputElement | null
		if (!target) return

		this._instance.value = target.value
	}

	private _removeInputListener(): void {
		if (this._input) {
			this._input.removeEventListener('input', this._onInput)
		}
	}
}
