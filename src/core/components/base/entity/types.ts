// Общий тип props (универсальный, для базовых объектов)
// Используется только там, где нужен "свободный словарь"
// export type TEntityProps = Record<string, unknown>
export type TEntityProps = {}

// Интерфейс для объектов, поддерживающих присвоение свойств из другого объекта
export interface IAssignable<T = TEntityProps> {
	assign(source: Partial<T>): void
}

// Параметризуемый базовый объект
export interface IEntity<TProps = TEntityProps> extends IAssignable<TProps> {
	/** Уникальный идентификатор объекта в рамках текущей сессии */
	readonly uid: number
	// Возвращает свойства объекта (только для чтения)
	getProps(): Readonly<TProps>
	// Сериализация объекта в JSON
	toJSON(): TProps
}
