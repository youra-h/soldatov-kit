import type { IPresentable, IPresentableProps, TPresentableEvents } from '../presentable'
import type { IPresentableOptions, TPresentableStatesOptions } from '../presentable'
import type { TDisableableStateCtor, TFocusableStateCtor } from '../states'

export type TInteractiveEvents = TPresentableEvents & {
	/** change:disabled */
	'change:disabled': (value: boolean) => void
	/** change:focused */
	'change:focused': (value: boolean) => void
	/** click proxy (UI-слой может дергать этот метод) */
	click: (event: Event) => void
}

export interface IInteractiveProps extends IPresentableProps {
	disabled?: boolean
	focused?: boolean
}

export type TInteractiveStatesOptions = TPresentableStatesOptions & {
	disableable?: TDisableableStateCtor
	focusable?: TFocusableStateCtor
}

export interface IInteractive<
	TProps extends IInteractiveProps = IInteractiveProps,
	TEvents extends Record<string, (...args: any) => any> = TInteractiveEvents,
> extends IPresentable<TProps, TEvents> {
	disabled: boolean
	focused: boolean
	click(event: Event): void
}
