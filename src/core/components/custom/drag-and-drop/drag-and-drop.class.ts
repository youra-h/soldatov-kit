import { TComponent } from '../../base/component'
import type { IComponentOptions } from '../../base/component'
import type { IDragAndDrop, IDragAndDropProps, TDragAndDropEvents } from './types'

export default class TDragAndDrop
	extends TComponent<IDragAndDropProps, TDragAndDropEvents>
	implements IDragAndDrop
{
	static defaultValues: Partial<IDragAndDropProps> = {
		...TComponent.defaultValues,
	}

	constructor(options: IComponentOptions<IDragAndDropProps> | Partial<IDragAndDropProps> = {}) {
		super(options)
	}
}
