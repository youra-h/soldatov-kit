export type TConstructor<T = {}> = new (...args: any[]) => T

export type TAbstractConstructor<T = {}> = abstract new (...args: any[]) => T

export type TComponentVariant =
	| 'normal'
	| 'accent'
	| 'secondary'
	| 'positive'
	| 'danger'
	| 'warning'

export type TComponentSize = 'sm' | 'normal' | 'auto' | 'lg' | 'xl' | '2xl'
