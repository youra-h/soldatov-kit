export type TListHighlightPluginEvents = {
	/** Смена подсвеченного элемента */
	'highlight:change': (uid: string | number | null) => void
}
