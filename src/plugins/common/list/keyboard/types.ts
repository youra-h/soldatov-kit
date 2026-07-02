import type { TListItemPluginEvents } from '../item/types'

export type TListKeyboardPluginEvents = {
	'change:highlight': (uid: string | number | null) => void
}
