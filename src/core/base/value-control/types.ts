import type { IInteractive, IInteractiveProps, TInteractiveEvents } from '../interactive'

export type TValueControlEvents<T> = TInteractiveEvents & {
	/** change:value */
	'change:value': (value: T) => void
	/** input:value (опционально) */
	'input:value': (value: T) => void
	/** change:name */
	'change:name': (value: string) => void
}

export interface IValueControlProps<T> extends IInteractiveProps {
	value: T
	name?: string
}

export interface IValueControl<
	T,
	TProps extends IValueControlProps<T> = IValueControlProps<T>,
	TEvents extends Record<string, (...args: any) => any> = TValueControlEvents<T>,
> extends IInteractive<TProps, TEvents> {
	value: T
	name: string
	input(value: T): void
}
