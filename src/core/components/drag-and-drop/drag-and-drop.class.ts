import { TComponentModel } from '../../base/component-model'
import type { IComponentModelOptions } from '../../base/component-model'
import type { IDragAndDrop, IDragAndDropProps, TDragAndDropEvents } from './types'

export default class TDragAndDrop
	extends TComponentModel<IDragAndDropProps, TDragAndDropEvents>
	implements IDragAndDrop
{
	static defaultValues: Partial<IDragAndDropProps> = {
		...TComponentModel.defaultValues,
	}

	constructor(options: IComponentModelOptions<IDragAndDropProps> | Partial<IDragAndDropProps> = {}) {
		super(options)
	}
}
