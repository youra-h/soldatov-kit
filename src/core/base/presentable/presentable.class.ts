import { TEvented } from '../../common/evented'
import TComponentModel from '../component-model/component-model.class'
import type { IPresentableProps, TPresentableEvents } from './types'

/**
 * Web-presentable слой: tag/classes/attrs.
 *
 * Это слой, который удобен для UI-обёрток (Vue/React):
 * - `tag` (div/button/custom)
 * - `classes` (baseClass + динамические)
 * - `attrs` (произвольные атрибуты)
 */
export default class TPresentable<
		TProps extends IPresentableProps = IPresentableProps,
		TEvents extends TPresentableEvents = TPresentableEvents,
	>
	extends TComponentModel<TProps, TEvents>
{
	static defaultValues: Partial<IPresentableProps> = {
		id: '',
		tag: 'div',
		classes: [],
		attrs: {},
		baseClass: 's-presentable',
	}

	protected _tag: string | object
	protected _baseClass: string
	protected _classes: string[]
	protected _attrs: Record<string, unknown>

	constructor(options: any = {}) {
		options = TComponentModel.prepareOptions(options)

		super(options)

		const { props = {} } = options

		this._tag = props.tag ?? TPresentable.defaultValues.tag!
		this._baseClass = props.baseClass ?? TPresentable.defaultValues.baseClass!
		this._classes = (props.classes ?? TPresentable.defaultValues.classes!) as string[]
		this._attrs = (props.attrs ?? TPresentable.defaultValues.attrs!) as Record<string, unknown>
	}

	get tag(): string | object {
		return this._tag
	}
	set tag(value: string | object) {
		if (this._tag === value) return

		this._tag = value

		this.events.emit('change:tag' as any, value)
	}

	get attrs(): Record<string, unknown> {
		return this._attrs
	}
	set attrs(value: Record<string, unknown>) {
		if (this._attrs === value) return

		this._attrs = value

		this.events.emit('change:attrs' as any, value)
	}

	get classes(): string[] {
		return [this._baseClass, ...this._classes]
	}

	setClasses(value: string[]): void {
		if (this._classes === value) return

		this._classes = value

		this.events.emit('change:classes' as any, value)
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			tag: this._tag,
			baseClass: this._baseClass,
			classes: this._classes,
			attrs: this._attrs,
		} as TProps
	}
}
