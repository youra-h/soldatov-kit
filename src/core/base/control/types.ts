import type { IStylable, IStylableProps, TStylableEvents } from '../stylable'

export type TControlEvents = TStylableEvents & {
	/** change:disabled */
	'change:disabled': (value: boolean) => void
	/** change:focused */
	'change:focused': (value: boolean) => void
	/** click proxy (-слой может дергать этот метод) */
	click: (event: Event) => void
}

export interface IControlProps extends IStylableProps {
	disabled?: boolean
	focused?: boolean
}

export interface IControl<
	TProps extends IControlProps = IControlProps,
	TEvents extends Record<string, (...args: any) => any> = TControlEvents,
> extends IStylable<TProps, TEvents> {
	disabled: boolean
	focused: boolean
	click(event: Event): void
}
