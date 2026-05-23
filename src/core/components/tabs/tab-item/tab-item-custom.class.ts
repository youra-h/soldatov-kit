import TValueControl from '../../../base/value-control/value-control.class'
import type { IComponentViewOptions } from '../../../base/component-view'
import { TComponentView } from '../../../base/component-view'
import { resolveState } from '../../../common/resolve-state'
import { TStateUnit, type IStateUnit } from '../../../common/state-unit'
import { type TValuePayload } from '../../../common/types'
import type {
	ITabItemCustom,
	ITabItemCustomProps,
	TTabItemCustomEvents,
	TTabItemCustomStatesOptions,
} from './types'
import { TEvented } from '../../../common/evented'

/**
 * Кастомная логика элемента таба (без коллекционной части).
 * Наследуется от TValueControl, где value — это ключ таба.
 * Generic TProps позволяет передавать расширенные Props (например, ITabItemProps с active).
 */
export default class TTabItemCustom<
	TProps extends ITabItemCustomProps = ITabItemCustomProps,
	TEvents extends TTabItemCustomEvents<any> = TTabItemCustomEvents,
>
	extends TValueControl<string | number, TProps, TEvents, TTabItemCustomStatesOptions>
	implements ITabItemCustom<TProps>
{
	static override baseClass = 's-tab-item'

	static defaultValues: Partial<ITabItemCustomProps> = {
		...TValueControl.defaultValues,
		text: '',
		value: '',
		closable: undefined,
		variant: 'normal',
		tag: 'button',
	}

	protected _textState: IStateUnit<string>
	protected _closableState: IStateUnit<boolean | undefined>

	constructor(
		options: IComponentViewOptions<TProps, TTabItemCustomStatesOptions> | Partial<TProps> = {},
	) {
		super(options)

		const { props = {}, states } = TComponentView.prepareOptions<
			TProps,
			TTabItemCustomStatesOptions
		>(options)

		// Type assertion: TProps extends ITabItemCustomProps, поэтому props содержит text и closable
		const customProps = props as Partial<ITabItemCustomProps>

		// Инициализация state-объектов
		this._textState = resolveState<IStateUnit<string>, string>({
			state: states?.text,
			ctor: TStateUnit,
			initial: customProps.text ?? TTabItemCustom.defaultValues.text!,
		})

		this._closableState = resolveState<IStateUnit<boolean | undefined>, boolean | undefined>({
			state: states?.closable,
			ctor: TStateUnit,
			initial: customProps.closable ?? TTabItemCustom.defaultValues.closable,
		})

		// Подписка на изменения state-объектов
		this._textState.events.on('change', (payload: TValuePayload<string>) => {
			;(this.events as TEvented<TTabItemCustomEvents>).emit('change:text', payload.newValue)
		})

		this._closableState.events.on('change', (payload: TValuePayload<boolean | undefined>) => {
			;(this.events as TEvented<TTabItemCustomEvents>).emit(
				'change:closable',
				payload.newValue,
			)
		})

		this._classes.toggle(`--closable`, !!this._closableState.value)

		this.events.on('change:disabled', () => {
			// Если таб стал disabled, убираем возможность закрывать его
			if (this.disabled) {
				this._applyClosable(false)
			} else {
				// Если таб стал enabled, восстанавливаем closable в исходное значение (или дефолтное)
				this._applyClosable(customProps.closable ?? TTabItemCustom.defaultValues.closable)
			}
		})
	}

	get text(): string {
		return this._textState.value
	}

	set text(value: string) {
		this._textState.value = value
	}

	get closable(): boolean | undefined {
		return this._closableState.value
	}

	protected _applyClosable(value: boolean | undefined) {
		this._classes.toggle(`--closable`, !!value)

		this._closableState.value = value
	}

	set closable(value: boolean | undefined) {
		if (this._closableState.value === value || this.disabled) return

		this._applyClosable(value)
	}

	close(): void {
		;(this.events as TEvented<TTabItemCustomEvents>).emit('close', this)
	}

	override getProps(): TProps {
		return {
			...super.getProps(),
			text: this.text,
			closable: this.closable,
		} as TProps
	}
}
