import type { IInteractive, IInteractiveProps, TInteractiveEvents } from '../interactive'

export type TTextableEvents = TInteractiveEvents & {
	/** change:text */
	'change:text': (value: string) => void
}

export interface ITextableProps extends IInteractiveProps {
	/** Отображаемый текст компонента (не путать с value у контролов). */
	text?: string
}

export interface ITextable<
	TProps extends ITextableProps = ITextableProps,
	TEvents extends Record<string, (...args: any) => any> = TTextableEvents,
> extends IInteractive<TProps, TEvents> {
	text: string
}
