import { TCollection } from './collection.class'

export interface ICollectionItem {
	// Ссылка на коллекцию-владелец.
	collection: TCollection | null
	// Уникальный идентификатор элемента внутри коллекции.
	id?: number
	// Текущее положение элемента в коллекции.
	index: number
	// Копирует данные из другого элемента.
	// По умолчанию копирует только id, наследники расширяют логику.
	// @param source Источник данных для копирования.
	assign(source: ICollectionItem): void
	// Вызывает changed() для нотификации коллекции/владельца.
	changed(): void
	// Освобождает ресурсы, отписывается от событий и т.д.
	free(): void
}

export type TCollectionEvents = {
	changed: (collection: TCollection) => void
	beforeChange: () => boolean
}
