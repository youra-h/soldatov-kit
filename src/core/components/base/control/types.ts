import type { IStylable, IStylableProps, TStylableEvents, TStylableStates } from '../stylable'
import type { IStateUnit } from '../../../common'

export type TControlEvents = TStylableEvents & {
	'change:disabled': (value: boolean) => void
	'change:focused': (value: boolean) => void
}

export interface IControlProps extends IStylableProps {
	disabled?: boolean
	focused?: boolean
}

export type TControlStates = TStylableStates & {
	disabled: IStateUnit<boolean>
	focused: IStateUnit<boolean>
}

export interface IControl<
	TProps extends IControlProps = IControlProps,
	TEvents extends Record<string, (...args: any) => any> = TControlEvents,
	TStates extends TControlStates = TControlStates,
> extends IStylable<TProps, TEvents, TStates> {
	disabled: boolean
	focused: boolean
}
