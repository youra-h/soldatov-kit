import type { PropType, Ref } from 'vue'
import {
	type IListBoxItemCustom,
	type IListBoxItemCustomProps,
	TListBoxItemCustom,
	type TListBoxAppearance,
} from '@core'
import {
	default as BaseListItemCustom,
	emitsListItemCustom,
	propsListItemCustom,
	syncListItemCustom,
	type IListItemCustomState,
} from '../../list/list-item'
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../../types'
import { useSyncProps } from '../../../composables/useSyncProps'

export const emitsListBoxItemCustom: TEmits = [
	...emitsListItemCustom,
] as const

export const propsListBoxItemCustom: TProps = {
	...propsListItemCustom,
	appearance: {
		type: String as PropType<IListBoxItemCustomProps['appearance']>,
		default: 'plain',
	},
}

export default {
	name: 'BaseListBoxItemCustom',
	extends: BaseListItemCustom,
	emits: emitsListBoxItemCustom,
	props: propsListBoxItemCustom,
}

export interface IListBoxItemCustomState extends IListItemCustomState {
	appearance: Ref<TListBoxAppearance>
}

export function syncListBoxItemCustom(
	options: ISyncComponentViewOptions<IListBoxItemCustomProps, IListBoxItemCustom>,
): IListBoxItemCustomState {
	const syncProps = syncListItemCustom(options)

	const { instance } = options

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			appearance: () => instance.appearance,
		}),
	}
}
