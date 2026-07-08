import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import {
	type IActivatableCollectionItem,
	type IActivatableCollectionItemProps,
	TActivatableCollectionItem,
} from '@core'
import {
	BaseCollectionItem,
	emitsCollectionItem,
	propsCollectionItem,
	syncCollectionItem,
	type ICollectionItemState,
} from '../item'
import type { TEmits, TProps, ISyncComponentOptions } from '../../../types'
import { useSyncProps } from '../../../composables/useSyncProps'

export const emitsActivatableCollectionItem: TEmits = [
	...emitsCollectionItem,
	'change:activation',
	'update:active',
] as const

export const propsActivatableCollectionItem: TProps = {
	...propsCollectionItem,
	active: {
		type: Boolean as PropType<IActivatableCollectionItemProps['active']>,
		default: TActivatableCollectionItem.defaultValues.active,
	},
}

export default {
	name: 'BaseActivatableCollectionItem',
	extends: BaseCollectionItem,
	emits: emitsActivatableCollectionItem,
	props: propsActivatableCollectionItem,
}

export interface IActivatableCollectionItemState<
	T extends IActivatableCollectionItem = IActivatableCollectionItem,
> extends ICollectionItemState<T> {
	active: Ref<boolean | undefined>
}

/**
 * Синхронизация props и событий для ActivatableCollectionItem
 */
export function syncActivatableCollectionItem(
	options: ISyncComponentOptions<
		IActivatableCollectionItemProps,
		IActivatableCollectionItem
	>,
): IActivatableCollectionItemState {
	const syncProps = syncCollectionItem(options)

	const { props, instance, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on('change:activation', (item: IActivatableCollectionItem) => {
		// Переприменяем active через proxy — иначе _classes.toggle('--active', ...) вызывается
		// на raw-объекте и мутация Set не видна Vue (нет реактивного триггера)
		instance.active = (item as unknown as { active: boolean }).active

		emit?.('change:activation', item)
		emit?.('update:active', instance.active)
	})

	watch(
		() => props.active,
		(value) => {
			if (value !== undefined && value !== instance.active) {
				instance.active = value
			}
		},
		{ immediate: true },
	)

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			active: {
				value: () => instance.active,
				triggers: ['change:activation'],
			},
		}),
	}
}
