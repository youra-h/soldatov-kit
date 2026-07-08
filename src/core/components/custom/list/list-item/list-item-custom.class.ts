import { TValueControl } from '../../../base'
import type { IComponentViewOptions } from '../../../base/component-view'
import { TComponentView } from '../../../base/component-view'
import { TStateUnit, TEvented } from '../../../../common'
import type { TValuePayload } from '../../../../bridge'
import type {
	IListItemCustom,
	IListItemCustomProps,
	TListItemCustomEvents,
	TListItemCustomStates,
} from './types'

export default class TListItemCustom<
	TProps extends IListItemCustomProps = IListItemCustomProps,
	TEvents extends TListItemCustomEvents<any> = TListItemCustomEvents,
>
	extends TValueControl<string | number, TProps, TEvents, TListItemCustomStates>
	implements IListItemCustom<TProps>
{
	static override baseClass = 's-list-item'

	static defaultValues: Partial<IListItemCustomProps> = {
		...TValueControl.defaultValues,
		text: '',
		value: undefined,
		wordWrap: undefined,
		variant: 'normal',
		tag: 'div',
	}

	constructor(
		options:
			| IComponentViewOptions<TProps, TListItemCustomStates>
			| Partial<TProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TListItemCustom

		const { props = {}, states } = TComponentView.prepareOptions<
			TProps,
			TListItemCustomStates
		>(options)

		const customProps = props as Partial<IListItemCustomProps>

		this._states.text =
			states?.text ??
			new TStateUnit<string>({ initial: customProps.text ?? ctor.defaultValues.text! })

		this._states.text.events.on('change', (payload: TValuePayload<string>) => {
			;(this.events as TEvented<TListItemCustomEvents>).emit('change:text', payload)
		})

		this._states.wordWrap =
			states?.wordWrap ??
			new TStateUnit<boolean | undefined>({
				initial: customProps.wordWrap ?? ctor.defaultValues.wordWrap,
			})

		this._states.wordWrap.events.on(
			'change',
			(payload: TValuePayload<boolean | undefined>) => {
				this._classes.toggle('--word-wrap', !!payload.newValue)

				this.notifyWordWrapChange()
			},
		)

		this._classes.toggle('--word-wrap', !!this._states.wordWrap.value)
	}

	get text(): string {
		return this._states.text.value
	}

	set text(value: string) {
		this._states.text.value = value
	}

	get wordWrap(): boolean | undefined {
		return this._states.wordWrap.value
	}

	set wordWrap(value: boolean | undefined) {
		if (this._states.wordWrap.rawValue === value) return

		this._states.wordWrap.value = value
	}

	/** Инжектируется из TList при добавлении элемента в коллекцию */
	setWordWrapResolver(resolver: () => boolean): void {
		;(this._states.wordWrap as TStateUnit<boolean | undefined>).setResolver(
			(current) => current ?? resolver() ?? false,
		)
	}

	/**
	 * Уведомляет UI об изменении wordWrap.
	 */
	notifyWordWrapChange(): void {
		;(this.events as TEvented<TListItemCustomEvents>).emit(
			'change:wordWrap',
			!!this.wordWrap,
		)
	}

	override getProps(): TProps {
		return {
			...super.getProps(),
			text: this.text,
			wordWrap: this.wordWrap,
		} as TProps
	}
}
