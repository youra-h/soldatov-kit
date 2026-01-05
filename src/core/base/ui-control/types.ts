import type { IStylable, IStylableProps, TStylableEvents } from '../stylable'

export type TUiControlEvents = TStylableEvents & {
	/** change:disabled */
	'change:disabled': (value: boolean) => void
	/** change:focused */
	'change:focused': (value: boolean) => void
	/** click proxy (UI-слой может дергать этот метод) */
	click: (event: Event) => void
}

/**
 * @deprecated Используйте `TUiControlEvents`.
 */
export type TStylableInteractiveEvents = TUiControlEvents

export interface IUiControlProps extends IStylableProps {
	disabled?: boolean
	focused?: boolean
}

/**
 * @deprecated Используйте `IUiControlProps`.
 */
export interface IStylableInteractiveProps extends IUiControlProps {}

export interface IUiControl<
	TProps extends IUiControlProps = IUiControlProps,
	TEvents extends Record<string, (...args: any) => any> = TUiControlEvents,
> extends IStylable<TProps, TEvents> {
	disabled: boolean
	focused: boolean
	click(event: Event): void
}

/**
 * @deprecated Используйте `IUiControl`.
 */
export type IStylableInteractive<
	TProps extends IStylableInteractiveProps = IStylableInteractiveProps,
	TEvents extends Record<string, (...args: any) => any> = TStylableInteractiveEvents,
> = IUiControl<TProps, TEvents>
