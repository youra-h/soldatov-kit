import type { IUiControl, IUiControlProps, TUiControlEvents } from '../ui-control'

export type TValueControlEvents<T> = TUiControlEvents & {
	/** change:value */
	'change:value': (value: T) => void
	/** input:value (опционально) */
	'input:value': (value: T) => void
	/** change:name */
	'change:name': (value: string) => void
}

export interface IValueControlProps<T> extends IUiControlProps {
	value: T
	name?: string
}

export interface IValueControl<
	T,
	TProps extends IValueControlProps<T> = IValueControlProps<T>,
	TEvents extends Record<string, (...args: any) => any> = TValueControlEvents<T>,
> extends IUiControl<TProps, TEvents> {
	value: T
	name: string
	input(value: T): void
}
