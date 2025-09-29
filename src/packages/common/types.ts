export type TEmits = readonly string[]
export type TProps = Readonly<Record<string, any>>

export interface ISyncComponentOptions<T> {
	instance: T
	props: TProps
	emit?: (event: string, ...args: any[]) => void
}
