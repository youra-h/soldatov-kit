import { TSelectableCollectionItem } from '../collection'

/**
 * Поведение выбранности.
 *
 * Сейчас это тонкий алиас над `TSelectableCollectionItem`, чтобы:
 * - переиспользовать готовую логику `selected`
 * - иметь отдельный тип поведения для `TBehaviorTreeItem`
 */
export class TSelectableBehavior extends TSelectableCollectionItem {}
