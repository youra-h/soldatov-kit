import { TCollectionItem } from '../item/collection-item.class'
import type {
	IActivatableCollectionItem,
	IActivatableCollectionItemProps,
	TActivatableItemEvents,
} from './types'

/**
 * Элемент коллекции с поддержкой активности.
 */
export class TActivatableCollectionItem<
	TProps extends IActivatableCollectionItemProps = IActivatableCollectionItemProps,
	TEvents extends TActivatableItemEvents<IActivatableCollectionItem> =
		TActivatableItemEvents<IActivatableCollectionItem>,
>
	extends TCollectionItem<TProps, TEvents>
	implements IActivatableCollectionItem
{
	static defaultValues: Partial<IActivatableCollectionItemProps> = {
		active: false,
	}

	protected _active = TActivatableCollectionItem.defaultValues.active!

	getProps(): TProps {
		return {
			...super.getProps(),
			active: this._active,
		} as TProps
	}

	get active(): boolean {
		return this._active
	}

	set active(value: boolean) {
		if (this._active !== value) {
			this._active = value

			this.events.emit('change', this)
		}
	}

	toggleActive(): void {
		this.active = !this.active
	}
}
