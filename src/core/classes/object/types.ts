// Общий тип props (универсальный, для базовых объектов)
// Используется только там, где нужен "свободный словарь"
// export type TObjectProps = Record<string, unknown>
export type TObjectProps = {}

// Интерфейс для объектов, поддерживающих присвоение свойств из другого объекта
export interface IAssignable<T = TObjectProps> {
	assign(source: Partial<T>): void
}

// Параметризуемый базовый объект
export interface IObject<TProps = TObjectProps> extends IAssignable<TProps> {
	// Возвращает свойства объекта (только для чтения)
	getProps(): Readonly<TProps>
	// Сериализация объекта в JSON
	toJSON(): TProps
}
