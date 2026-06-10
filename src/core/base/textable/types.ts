import type { IControl, IControlProps, TControlEvents, TControlStates } from '../control'
import type { IStateUnit } from '../../common/state-unit'
import { type TValuePayload } from '../../common/types'

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
> extends IControl<TProps, TEvents> {
	text: string
}
