import { TStateUnit, type IStateUnit } from '../state-unit'
import { TControl } from '../control'
import type { IComponentViewOptions } from '../component-view'
import { TComponentView } from '../component-view'
import { resolveState } from '../../common/resolve-state'
import type { ITextableProps, TTextableEvents, TTextableStatesOptions } from './types'

/**
 * Слой "textable": добавляет отображаемое текстовое значение `text`.
 *
 * Правило проекта:
 * - `value` — скрытое/внутреннее значение контрола
 * - `text` — то, что выводится на экран
 */
export default class TTextable<
	TProps extends ITextableProps = ITextableProps,
	TEvents extends TTextableEvents = TTextableEvents,
	TStates extends TTextableStatesOptions = TTextableStatesOptions,
> extends TControl<TProps, TEvents, TStates> {
	static defaultValues: Partial<ITextableProps> = {
		...TControl.defaultValues,
		text: '',
	}

	protected _textState: IStateUnit<string>

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		const text = props.text ?? (TTextable.defaultValues.text as string)

		this._textState = resolveState<IStateUnit<string>, string>(
			states?.text,
			TStateUnit as unknown as new (initial: string) => IStateUnit<string>,
			text,
		)

		this._textState.events.on('change', (value) => {
			this.events.emit('change:text' as any, value)
		})
	}

	get text(): string {
		return this._textState.value
	}

	set text(value: string) {
		this._textState.value = value
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			text: this.text,
		} as TProps
	}
}
