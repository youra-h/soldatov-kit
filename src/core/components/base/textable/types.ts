import type { IControl, IControlProps, TControlEvents, TControlStates } from '../control'
import type { IStateUnit } from '../../../common'
import type { TValuePayload } from '../../../bridge'

export type TTextableEvents = TControlEvents & {
	/** change:text */
	'change:text': (payload: TValuePayload<string>) => void
}

export interface ITextableProps extends IControlProps {
	/** Отображаемый текст компонента (не путать с value у контролов). */
	text?: string
}

export type TTextableStates = TControlStates & {
	text: IStateUnit<string>
}

export interface ITextable<
	TProps extends ITextableProps = ITextableProps,
	TEvents extends Record<string, (...args: any) => any> = TTextableEvents,
	TStates extends TTextableStates = TTextableStates,
> extends IControl<TProps, TEvents, TStates> {
	text: string
}
