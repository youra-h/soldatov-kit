import type { IAssignable } from '../../common/types'

export type TObjectProps = Record<string, any>

export interface IObject extends IAssignable<TObjectProps> {
	getProps(): TObjectProps
}
