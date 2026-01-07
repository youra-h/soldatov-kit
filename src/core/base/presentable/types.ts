import type {
	IComponentModel,
	IComponentModelOptions,
	IComponentModelProps,
	TComponentModelEvents,
} from '../component-model'
import type { IVisibilityState, TVisibilityStateCtor } from '../states'

export type TPresentableStateKey = 'rendered' | 'visible'

export type TPresentableVisibilityStateFactory = (
	key: TPresentableStateKey,
	initial: boolean,
) => IVisibilityState

export type TPresentableStatesOptions = {
	/** Класс state для `rendered` (если не задана factory). */
	rendered?: TVisibilityStateCtor
	/** Класс state для `visible` (если не задана factory). */
	visible?: TVisibilityStateCtor
}

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
	/** change:rendered */
	'change:rendered': (value: boolean) => void

	/** change:tag */
	'change:tag': (value: string | object) => void
	/** change:classes (без baseClass) */
	'change:classes': (value: string[]) => void
	/** change:attrs */
	'change:attrs': (value: Record<string, unknown>) => void
}

export interface IPresentableProps extends IComponentModelProps {
	tag?: string | object
	/** Отрисован ли компонент в DOM (аналог v-if) */
	rendered?: boolean
	/** Виден ли компонент (логическая видимость) */
	visible?: boolean
	classes?: string[] // dynamic classes (без baseClass)
	attrs?: Record<string, unknown>
	baseClass?: string
}

/**
 * Опции для presentable-слоя.
 * props — начальные свойства, baseClass — базовый CSS-класс (можно переопределить для конкретного инстанса).
 */
export interface IPresentableOptions<TProps extends IPresentableProps = IPresentableProps>
	extends IComponentModelOptions<TProps>
{
	baseClass?: string
	/**
	 * Инъекция state-реализаций для rendered/visible.
	 * Нужна, чтобы менять поведение state свойств без оверрайда геттеров/сеттеров.
	 */
	states?: TPresentableStatesOptions
}

/**
 * Результат нормализации опций presentable-слоя.
 * Здесь `baseClass` гарантированно вычислен.
 */
export type TPresentablePreparedOptions<TProps extends IPresentableProps = IPresentableProps> =
	IPresentableOptions<TProps> & { baseClass: string }

export interface IPresentable<
	TProps extends IPresentableProps = IPresentableProps,
	TEvents extends Record<string, (...args: any) => any> = TPresentableEvents,
> extends IComponentModel<TProps, TEvents> {
	readonly classes: string[]
	readonly attrs: Record<string, unknown>
	tag: string | object
	rendered: boolean
	visible: boolean
	show(): void
	hide(): void
}
