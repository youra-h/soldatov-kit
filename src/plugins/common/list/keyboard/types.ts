import type { TListItemPluginEvents } from '../item/types'

export type TListKeyboardPluginEvents = {
	'highlight:change': (uid: string | number | null) => void
}
