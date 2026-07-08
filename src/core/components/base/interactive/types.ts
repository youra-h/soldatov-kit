import type { IComponentView, IComponentViewProps, TComponentViewEvents } from '../component-view'
import type { TComponentViewStates } from '../component-view'
import type { IStateUnit } from '../../../common'

export type TInteractiveEvents = TComponentViewEvents & {
	/** change:disabled */
	'change:disabled': (value: boolean) => void
	/** change:focused */
	'change:focused': (value: boolean) => void
}

export interface IInteractiveProps extends IComponentViewProps {
	disabled?: boolean
	focused?: boolean
}

export type TInteractiveStates = TComponentViewStates & {
	disabled: IStateUnit<boolean>
	focused: IStateUnit<boolean>
}

export interface IInteractive<
	TProps extends IInteractiveProps = IInteractiveProps,
	TEvents extends Record<string, (...args: any) => any> = TInteractiveEvents,
	TStates extends TInteractiveStates = TInteractiveStates,
> extends IComponentView<TProps, TEvents, TStates> {
	disabled: boolean
	focused: boolean
}
