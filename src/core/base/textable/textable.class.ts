import { TTextState } from '../states'
import { TControl } from '../control'
import type { IPresentableOptions } from '../presentable'
import { TPresentable } from '../presentable'
import type { ITextableProps, TTextableEvents } from './types'

/**
 * Слой "textable": добавляет отображаемое текстовое значение `text`.
 *
 * Правило проекта:
 * - `value` — скрытое/внутреннее значение контрола
 * - `text` — то, что выводится на экран
 */
export default class TTextable<
	TProps extends ITextableProps = ITextableProps,
	TEvents extends TTextableEvents = TTextableEvents,
> extends TControl<TProps, TEvents> {
	static defaultValues: Partial<ITextableProps> = {
		...TControl.defaultValues,
		text: '',
	}

	protected _textState: TTextState

	constructor(options: IPresentableOptions<TProps> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps> } = TPresentable.prepareOptions<TProps>(
			options as any,
		)

		this._textState = new TTextState(props.text ?? (TTextable.defaultValues.text as string))

		this._textState.events.on('change', (value) => {
			this.events.emit('change:text' as any, value)
		})
	}

	get text(): string {
		return this._textState.text
	}

	set text(value: string) {
		this._textState.text = value
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			text: this.text,
		} as TProps
	}
}
