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
		TEvents extends
			TActivatableItemEvents<IActivatableCollectionItem> = TActivatableItemEvents<IActivatableCollectionItem>,
	>
	extends TCollectionItem<TProps, TEvents>
	implements IActivatableCollectionItem
{
	private _active = false

	// TODO: testing
	public value: any
	// TODO: testing
	getProps(): TProps {
		return {
			...super.getProps(),
			value: this.value,
		}
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
