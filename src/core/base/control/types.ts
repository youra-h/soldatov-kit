import type { IStylable, IStylableProps, TStylableEvents } from '../stylable'

export type TControlEvents = TStylableEvents & {
	/** change:disabled */
	'change:disabled': (value: boolean) => void
	/** change:focused */
	'change:focused': (value: boolean) => void
	/** click proxy (-слой может дергать этот метод) */
	click: (event: Event) => void
}

/**
 * @deprecated Используйте `TControlEvents`.
 */
export type TStylableInteractiveEvents = TControlEvents

export interface IControlProps extends IStylableProps {
	disabled?: boolean
	focused?: boolean
}

/**
 * @deprecated Используйте `IControlProps`.
 */
export interface IStylableInteractiveProps extends IControlProps {}

export interface IControl<
	TProps extends IControlProps = IControlProps,
	TEvents extends Record<string, (...args: any) => any> = TControlEvents,
> extends IStylable<TProps, TEvents> {
	disabled: boolean
	focused: boolean
	click(event: Event): void
}

/**
 * @deprecated Используйте `IControl`.
 */
export type IStylableInteractive<
	TProps extends IStylableInteractiveProps = IStylableInteractiveProps,
	TEvents extends Record<string, (...args: any) => any> = TStylableInteractiveEvents,
> = IControl<TProps, TEvents>
