import { type IComponentOptions } from '../component'
import { TControlValue, defaultControlValueValues } from '../control-value'
import type { ICheckBox, TCheckBoxEventsMap } from './types'
import type { TObjectProps } from '../object'

export const defaultValues: Partial<ICheckBox> = {
	...defaultControlValueValues,
}

export default class TCheckBox<TEvents extends TCheckBoxEventsMap>
	extends TControlValue<TEvents>
	implements ICheckBox
{
	constructor(options: IComponentOptions<ICheckBox> = { props: {}, baseClass: 's-check-box' }) {
		super(options)

		const { props = {} } = options
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			value: this._value,
		}
	}
}
