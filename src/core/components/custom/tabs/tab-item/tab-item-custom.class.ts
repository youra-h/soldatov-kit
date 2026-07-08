import { TValueControl } from '../../../base/value-control'
import type { IComponentViewOptions } from '../../../base/component-view'
import { TComponentView } from '../../../base/component-view'
import { TStateUnit, TEvented } from '../../../../common'
import type { TValuePayload } from '../../../../bridge'
import type {
	ITabItemCustom,
	ITabItemCustomProps,
	TTabItemCustomEvents,
	TTabItemCustomStates,
} from './types'

/**
 * Кастомная логика элемента таба (без коллекционной части).
 * Наследуется от TValueControl, где value — это ключ таба.
 * Generic TProps позволяет передавать расширенные Props (например, ITabItemProps с active).
 */
export default class TTabItemCustom<
	TProps extends ITabItemCustomProps = ITabItemCustomProps,
	TEvents extends TTabItemCustomEvents<any> = TTabItemCustomEvents,
>
	extends TValueControl<string | number, TProps, TEvents, TTabItemCustomStates>
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

	constructor(
		options: IComponentViewOptions<TProps, TTabItemCustomStates> | Partial<TProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TTabItemCustom

		const { props = {}, states } = TComponentView.prepareOptions<
			TProps,
			TTabItemCustomStates
		>(options)

		// Type assertion: TProps extends ITabItemCustomProps, поэтому props содержит text и closable
		const customProps = props as Partial<ITabItemCustomProps>

		// Инициализация state-объектов
		this._states.text =
			states?.text ??
			new TStateUnit<string>({ initial: customProps.text ?? ctor.defaultValues.text! })

		this._states.closable =
			states?.closable ??
			new TStateUnit<boolean | undefined>({
				initial: customProps.closable ?? ctor.defaultValues.closable,
			})

		// Подписка на изменения state-объектов
		this._states.text.events.on('change', (payload: TValuePayload<string>) => {
			;(this.events as TEvented<TTabItemCustomEvents>).emit('change:text', payload)
		})

		this._states.closable.events.on(
			'change',
			(payload: TValuePayload<boolean | undefined>) => {
				this._classes.toggle(`--closable`, !!payload.newValue)

				this.notifyClosableChange(payload.newValue)
			},
		)

		this._classes.toggle(`--closable`, !!this._states.closable.value)

		this.events.on('change:disabled', () => {
			// Если таб стал disabled, убираем возможность закрывать его
			if (this.disabled) {
				this._states.closable.value = false
			} else {
				// Если таб стал enabled, восстанавливаем closable в исходное значение (или дефолтное)
				this._states.closable.value =
					customProps.closable ?? ctor.defaultValues.closable
			}
		})
	}

	get text(): string {
		return this._states.text.value
	}

	set text(value: string) {
		this._states.text.value = value
	}

	get closable(): boolean | undefined {
		return this._states.closable.value
	}

	set closable(value: boolean | undefined) {
		if (this._states.closable.rawValue === value || this.disabled) return

		this._states.closable.value = value
	}

	/** Инжектируется из TTabs при добавлении таба в коллекцию */
	setClosableResolver(resolver: () => boolean): void {
		;(this._states.closable as TStateUnit<boolean | undefined>).setResolver(
			(current) => current ?? resolver() ?? false,
		)
	}

	/**
	 * Уведомляет UI об изменении closable, чтобы отобразить или скрыть крестик. Вызывается при изменении локального closable или при изменении родительского (через resolved).
	 * @param value Новое значение closable, которое нужно отразить в UI (например, показать или скрыть крестик).
	 */
	notifyClosableChange(value: boolean | undefined) {
		;(this.events as TEvented<TTabItemCustomEvents>).emit('change:closable', value)
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
