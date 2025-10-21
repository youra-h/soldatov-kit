// общий тип props
export type TObjectProps = Record<string, any>

// Интерфейс для объектов, поддерживающих присвоение свойств из другого объекта
export interface IAssignable<T = TObjectProps> {
	assign(source: Partial<T>): void
}

// параметризуемый базовый объект
export interface IObject<TProps extends TObjectProps = TObjectProps> extends IAssignable<TProps> {
	getProps(): TProps
}
