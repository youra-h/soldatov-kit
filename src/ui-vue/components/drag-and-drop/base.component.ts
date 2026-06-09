import type { TEmits, TProps } from '../../types'
import { BaseComponentModel, emitsComponentModel, propsComponentModel } from '../component-model'

export const emitsDragAndDrop: TEmits = [...emitsComponentModel] as const

export const propsDragAndDrop: TProps = {
	...propsComponentModel,
}

export default {
	name: 'BaseDragAndDrop',
	extends: BaseComponentModel,
	emits: emitsDragAndDrop,
	props: propsDragAndDrop,
}
