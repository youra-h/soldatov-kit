import type {
	IComponentModel,
	IComponentModelProps,
	TComponentModelEvents,
} from '../component-model'

export type TPresentableEvents = TComponentModelEvents & {
	/** beforeShow (можно отменить, вернув false) */
	beforeShow: () => boolean
	/** afterShow */
	afterShow: () => void
	/** beforeHide (можно отменить, вернув false) */
	beforeHide: () => boolean
	/** afterHide */
	afterHide: () => void
	/** show */
	show: () => void
	/** hide */
	hide: () => void
	/** change:visible */
	'change:visible': (value: boolean) => void

	/** change:tag */
	'change:tag': (value: string | object) => void
	/** change:classes (без baseClass) */
	'change:classes': (value: string[]) => void
	/** change:attrs */
	'change:attrs': (value: Record<string, unknown>) => void
}

export interface IPresentableProps extends IComponentModelProps {
	tag?: string | object
	/** Виден ли компонент (логическая видимость) */
	visible?: boolean
	classes?: string[] // dynamic classes (без baseClass)
	attrs?: Record<string, unknown>
	baseClass?: string
}

export interface IPresentable<
	TProps extends IPresentableProps = IPresentableProps,
	TEvents extends Record<string, (...args: any) => any> = TPresentableEvents,
> extends IComponentModel<TProps, TEvents> {
	readonly classes: string[]
	readonly attrs: Record<string, unknown>
	tag: string | object
	visible: boolean
	show(): void
	hide(): void
}
