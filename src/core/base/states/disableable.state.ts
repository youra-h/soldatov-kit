import { TStateUnit } from '../state-unit'

export type TDisableableStateEvents = {
	change: (value: boolean) => void
}


export class TDisableableState extends TStateUnit<TDisableableStateEvents> {
	private _disabled = false

	constructor(initial: boolean = false) {
		super()
		this._disabled = initial
	}

	get disabled(): boolean {
		return this._disabled
	}

	set disabled(value: boolean) {
		if (this._disabled === value) return

		this._disabled = value

		this.events.emit('change', value)
	}
}
