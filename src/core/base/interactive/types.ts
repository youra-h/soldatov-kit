import type { IComponentView, IComponentViewProps, TComponentViewEvents } from '../component-view'
import type { TComponentViewStatesOptions } from '../component-view'
import type { IStateUnit } from '../state-unit'
import type { TStateCtor } from '../states'

export type TInteractiveEvents = TComponentViewEvents & {
	/** change:disabled */
	'change:disabled': (value: boolean) => void
	/** change:focused */
	'change:focused': (value: boolean) => void
	/** click proxy (UI-слой может дергать этот метод) */
	click: (event: Event) => void
}

export interface IInteractiveProps extends IComponentViewProps {
	disabled?: boolean
	focused?: boolean
}

export type TInteractiveStatesOptions = TComponentViewStatesOptions & {
	disableable?: TStateCtor<IStateUnit<boolean>, boolean> | IStateUnit<boolean>
	focusable?: TStateCtor<IStateUnit<boolean>, boolean> | IStateUnit<boolean>
}

export interface IInteractive<
	TProps extends IInteractiveProps = IInteractiveProps,
	TEvents extends Record<string, (...args: any) => any> = TInteractiveEvents,
> extends IComponentView<TProps, TEvents> {
	disabled: boolean
	focused: boolean
	click(event: Event): void
}
