import { TTextState, type ITextState } from '../states'
import { TControl } from '../control'
import type { IPresentableOptions } from '../presentable'
import { TPresentable } from '../presentable'
import { resolveState } from '../../common/resolve-state'
import type { ITextableProps, TTextableEvents, TTextableStatesOptions } from './types'

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
	TStates extends TTextableStatesOptions = TTextableStatesOptions,
> extends TControl<TProps, TEvents, TStates> {
	static defaultValues: Partial<ITextableProps> = {
		...TControl.defaultValues,
		text: '',
	}

	protected _textState: ITextState

	constructor(options: IPresentableOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TPresentable.prepareOptions<
			TProps,
			TStates
		>(options)

		const text = props.text ?? (TTextable.defaultValues.text as string)

		this._textState = resolveState<ITextState, string>(states?.text, TTextState, text)

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
