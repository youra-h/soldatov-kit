export type TFrameStylePluginEvents = {
	/** Вызывается при изменении набора стилей фрейма */
	'change:styles': (styles: Record<string, string | number>) => void
}
