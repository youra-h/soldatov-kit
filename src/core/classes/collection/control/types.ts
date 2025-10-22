import type { ICollectionItemProps } from '../types'
import type { IControl } from '../../control'
import type { IControlValue } from '../../control-value'
import type { IControlInput } from '../../control-input'

export interface IControlItem extends ICollectionItemProps, IControl {}

export interface IControlValueItem extends IControlItem, IControlValue {}

export interface IControlInputItem extends IControlValueItem, IControlInput {}
