import type { TEmits, TProps } from '../../types'
import { BaseComponent, emitsComponent, propsComponent } from '../component'

export const emitsDragAndDrop: TEmits = [...emitsComponent] as const

export const propsDragAndDrop: TProps = {
	...propsComponent,
}

export default {
	name: 'BaseDragAndDrop',
	extends: BaseComponent,
	emits: emitsDragAndDrop,
	props: propsDragAndDrop,
}
