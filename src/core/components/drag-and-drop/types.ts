import type { IComponent, IComponentProps, TComponentEvents } from '../../base/component'

export interface IDragAndDropProps extends IComponentProps {}

export type TDragAndDropEvents = TComponentEvents & {}

export interface IDragAndDrop extends IComponent<IDragAndDropProps, TDragAndDropEvents> {}
