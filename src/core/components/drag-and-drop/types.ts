import type { IComponentModel, IComponentModelProps, TComponentModelEvents } from '../../base/component-model'

export interface IDragAndDropProps extends IComponentModelProps {}

export type TDragAndDropEvents = TComponentModelEvents & {}

export interface IDragAndDrop extends IComponentModel<IDragAndDropProps, TDragAndDropEvents> {}
