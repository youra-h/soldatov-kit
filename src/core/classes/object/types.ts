export type TObjectProps = Record<string, any>

export interface IObject {
	getProps(): TObjectProps
	assign(props: Partial<TObjectProps>): void
}
