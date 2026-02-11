import type { IControl, IControlProps, TControlEvents, TControlStatesOptions } from '../../base/control'
import type { TActivatableCollection } from '../../base/collection'
import type { ITabItem } from './tab-item/types'

export type TTabsOrientation = 'horizontal' | 'vertical'
export type TTabsAlignment = 'start' | 'center' | 'end' | 'stretch'
export type TTabsPosition = 'start' | 'end'
export type TTabsAppearance = 'line' | 'pills' | 'contained' | 'segmented'

export type TTabsEvents = TControlEvents & {
	/** change:orientation */
	'change:orientation': (value: TTabsOrientation) => void
	/** change:alignment */
	'change:alignment': (value: TTabsAlignment) => void
	/** change:position */
	'change:position': (value: TTabsPosition) => void
	/** change:appearance */
	'change:appearance': (value: TTabsAppearance) => void
	/** change:stretched */
	'change:stretched': (value: boolean) => void
	/** change:closable */
	'change:closable': (value: boolean) => void
	/** tab:added */
	'tab:added': (item: ITabItem) => void
	/** tab:removed */
	'tab:removed': (item: ITabItem) => void
	/** tab:close — эмитится перед удалением таба при закрытии */
	'tab:close': (item: ITabItem) => void
	/** tab:activated */
	'tab:activated': (item: ITabItem | undefined) => void
}

export interface ITabsProps extends IControlProps {
	/** Ориентация табов */
	orientation?: TTabsOrientation
	/** Выравнивание табов */
	alignment?: TTabsAlignment
	/** Позиция табов (для vertical) */
	position?: TTabsPosition
	/** Стиль отображения */
	appearance?: TTabsAppearance
	/** Растягивать табы на всю ширину/высоту */
	stretched?: boolean
	/** Разрешить закрытие табов (по умолчанию false) */
	closable?: boolean
}

export type TTabsStatesOptions = TControlStatesOptions

export interface ITabs extends IControl<ITabsProps, TTabsEvents> {
	/** Ориентация табов */
	orientation: TTabsOrientation
	/** Выравнивание табов */
	alignment: TTabsAlignment
	/** Позиция табов (для vertical) */
	position: TTabsPosition
	/** Стиль отображения */
	appearance: TTabsAppearance
	/** Растягивать табы на всю ширину/высоту */
	stretched: boolean
	/** Разрешить закрытие табов */
	closable: boolean
	/** Активный таб (из коллекции) */
	readonly activeItem: ITabItem | undefined
	/** Количество табов (из коллекции) */
	readonly count: number
	/** Доступ к коллекции табов */
	readonly collection: TActivatableCollection<any, any, ITabItem>
	/** Проверяет, может ли конкретный таб быть закрыт (item.closable ?? this.closable) */
	isTabClosable(item: ITabItem): boolean
	/** Закрывает таб: проверяет возможность, эмитит событие, удаляет из коллекции */
	closeTab(item: ITabItem): boolean
}

