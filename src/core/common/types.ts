export type TConstructor<T = {}> = new (...args: any[]) => T

export type TAbstractConstructor<T = {}> = abstract new (...args: any[]) => T

// Интерфейс для объектов, поддерживающих присвоение свойств из другого объекта
export interface IAssignable<T> {
	assign(source: Partial<T>): void
}

export type TComponentVariant =
	| 'normal'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'warning'

export type TComponentSize = 'sm' | 'normal' | 'auto' | 'lg' | 'xl' | '2xl'
