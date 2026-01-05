import { TEvented } from '../../common/evented'

/**
 * Базовая единица состояния.
 * Использует композицию для событий (events).
 */
export class TStateUnit<TEvents extends Record<string, (...args: any[]) => any>> {
	public readonly events: TEvented<TEvents>

	constructor() {
		this.events = new TEvented<TEvents>()
	}
}
