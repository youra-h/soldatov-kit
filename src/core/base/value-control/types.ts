import type { IControl, IControlProps, TControlEvents } from '../control'

export type TValueControlEvents<T> = TControlEvents & {
	/** change:value */
	'change:value': (value: T) => void
	/** input:value (опционально) */
	'input:value': (value: T) => void
	/** change:name */
	'change:name': (value: string) => void
}

export interface IValueControlProps<T> extends IControlProps {
	value: T
	name?: string
}

export interface IValueControl<
	T,
	TProps extends IValueControlProps<T> = IValueControlProps<T>,
	TEvents extends Record<string, (...args: any) => any> = TValueControlEvents<T>,
> extends IControl<TProps, TEvents> {
	value: T
	name: string
	input(value: T): void
}
