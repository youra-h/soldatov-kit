import { TCollectionItem } from '../../collection'
import {
	TControlValue,
	type IControlValueProps,
	type TControlValueEvents,
} from '../../control-value'

interface Props extends IControlValueProps {}

type TEvents = TControlValueEvents

export class TTabItem extends TControlValue<Props, TEvents> implements TCollectionItem {
	static defaultValues = {
		text: 'Tab item',
	}
}
