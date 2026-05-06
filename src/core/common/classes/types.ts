export type TClassEntry = string | (() => string | null | undefined | false)

export type TClassesEvents = {
	change: () => void
}
