import type { IControl, IControlProps, TControlEvents, TControlStatesOptions } from '../control'
import type { ITextState, TTextStateCtor } from '../states'

export type TTextableEvents = TControlEvents & {
	/** change:text */
	'change:text': (value: string) => void
}

export interface ITextableProps extends IControlProps {
	/** Отображаемый текст компонента (не путать с value у контролов). */
	text?: string
}

export type TTextableStatesOptions = TControlStatesOptions & {
	text?: TTextStateCtor | ITextState
}

export interface ITextable<
	TProps extends ITextableProps = ITextableProps,
	TEvents extends Record<string, (...args: any) => any> = TTextableEvents,
> extends IControl<TProps, TEvents> {
	text: string
}
