import type { TTextState } from '../states'
import { TTextState as TTextStateImpl } from '../states/text.state'
import TInteractive from '../interactive/interactive.class'
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
> extends TInteractive<TProps, TEvents> {
	static defaultValues: Partial<ITextableProps> = {
		...TInteractive.defaultValues,
		text: '',
	}

	protected _textState: TTextState

	constructor(options: any = {}) {
		super(options)

		const { props = {} } = options

		this._textState = new TTextStateImpl(props.text ?? (TTextable.defaultValues.text as string))

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
