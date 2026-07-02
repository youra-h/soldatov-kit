import type { IListItem } from '@core'

export type THighlightPayload = {
	item: IListItem | null
	prevItem: IListItem | null
	nextItem: IListItem | null
}

export type TListKeyboardPluginEvents = {
	'change:highlight': (payload: THighlightPayload) => void
}
