import type {
	IComponentModel,
	IComponentModelOptions,
	IComponentModelProps,
	TComponentModelEvents,
} from '../component-model'
import type { IVisibilityState, TVisibilityStateCtor } from '../states'

export type TComponentViewStatesOptions = {
	/** Класс state для `rendered`. */
	rendered?: TVisibilityStateCtor | IVisibilityState
	/** Класс state для `visible`. */
	visible?: TVisibilityStateCtor | IVisibilityState
}

export type TComponentViewEvents = TComponentModelEvents & {
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
}

export interface IComponentViewProps extends IComponentModelProps {
	tag?: string | object
	/** Отрисован ли компонент в DOM (аналог v-if) */
	rendered?: boolean
	/** Виден ли компонент (логическая видимость) */
	visible?: boolean
}

/**
 * Конфигурация рендеринга компонента (НЕ сериализуется в props/JSON).
 */
export interface IComponentViewRenderConfig {
	/** Базовый CSS-класс компонента (переопределяет дефолтный из класса) */
	baseClass?: string
	/** Дополнительные CSS-классы (без baseClass) */
	classes?: string[]
}

/**
 * Опции для component-view-слоя.
 * props — начальные свойства, renderConfig — конфигурация отображения, states — инъекция state-объектов.
 */
export interface IComponentViewOptions<
	TProps extends IComponentViewProps = IComponentViewProps,
	TStates extends TComponentViewStatesOptions = TComponentViewStatesOptions,
> extends IComponentModelOptions<TProps> {
	/** Конфигурация рендеринга (baseClass, classes) */
	renderConfig?: IComponentViewRenderConfig
	/**
	 * Инъекция state-реализаций для rendered/visible.
	 * Нужна, чтобы менять поведение state свойств без оверрайда геттеров/сеттеров.
	 */
	states?: TStates
}

/**
 * Результат нормализации опций component-view-слоя.
 * renderConfig всегда определен с дефолтными значениями.
 */
export type TComponentViewPreparedOptions<
	TProps extends IComponentViewProps = IComponentViewProps,
	TStates extends TComponentViewStatesOptions = TComponentViewStatesOptions,
> = {
	props: Partial<TProps>
	renderConfig: Required<IComponentViewRenderConfig>
	states?: TStates
}

export interface IComponentView<
	TProps extends IComponentViewProps = IComponentViewProps,
	TEvents extends Record<string, (...args: any) => any> = TComponentViewEvents,
> extends IComponentModel<TProps, TEvents> {
	/** HTML-тег или компонент */
	tag: string | object
	/** Отрисован в DOM */
	rendered: boolean
	/** Логическая видимость */
	visible: boolean
	/** CSS-классы (включая baseClass и динамические) */
	readonly classes: string[]
	/** Показать компонент */
	show(): void
	/** Скрыть компонент */
	hide(): void
}
