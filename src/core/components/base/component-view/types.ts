import type { TClasses } from '@/core/common/classes'
import type {
	IComponent,
	IComponentOptions,
	IComponentProps,
	TComponentEvents,
	TComponentStates,
} from '../component'

export type TComponentViewStates = TComponentStates

export type TComponentViewEvents = TComponentEvents & {
	/** change:tag */
	'change:tag': (value: string | object) => void
	/** change:classes (без baseClass) */
	'change:classes': (value: string[]) => void
	/** change:ready — срабатывает когда компонент монтируется/демонтируется из DOM */
	'change:ready': (value: boolean) => void
}

export interface IComponentViewProps extends IComponentProps {
	tag?: string | object
}

/**
 * Опции для component-view-слоя.
 * props — начальные свойства, states — инъекция state-объектов.
 */
export interface IComponentViewOptions<
	TProps extends IComponentViewProps = IComponentViewProps,
	TStates extends TComponentViewStates = TComponentViewStates,
> extends IComponentOptions<TProps, TStates> {}

export interface IComponentView<
	TProps extends IComponentViewProps = IComponentViewProps,
	TEvents extends Record<string, (...args: any) => any> = TComponentViewEvents,
	TStates extends TComponentViewStates = TComponentViewStates,
> extends IComponent<TProps, TEvents, TStates> {
	/** HTML-тег или компонент */
	tag: string | object
	/** CSS-классы (включая baseClass и динамические) */
	readonly classes: TClasses
	/** Компонент смонтирован в DOM и готов (устанавливается плагин-слоем) */
	ready: boolean
}
