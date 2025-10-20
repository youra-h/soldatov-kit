export type TConstructor<T = {}> = new (...args: any[]) => T

export type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T

export type TComponentVariant =
	| 'normal'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'warning'

export type TComponentSize = 'sm' | 'normal' | 'auto' | 'lg' | 'xl' | '2xl'
