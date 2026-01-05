import { TStateUnit } from '../state-unit'

export type TTextStateEvents = {
	change: (value: string) => void
}


export class TTextState extends TStateUnit<TTextStateEvents> {
	private _text = ''

	constructor(initial: string = '') {
		super()
		this._text = initial
	}

	get text(): string {
		return this._text
	}

	set text(value: string) {
		if (this._text === value) return

		this._text = value

		this.events.emit('change', value)
	}
}
