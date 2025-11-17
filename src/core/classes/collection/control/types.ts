import type { ICollectionItemProps } from '../types'
import type { IControlProps } from '../../control'
import type { IControlValueProps } from '../../control-value'
import type { IControlInput } from '../../control-input'

export interface IControlItem extends ICollectionItemProps, IControlProps {}

export interface IControlValueItem extends IControlItem, IControlValueProps {}

export interface IControlInputItem extends IControlValueItem, IControlInput {}
