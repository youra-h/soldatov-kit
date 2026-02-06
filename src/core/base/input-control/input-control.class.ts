import { TLoadingState, type ILoadingState } from '../states'
import { TValueControl } from '../value-control'
import type { IInputControlProps, TInputControlEvents, TInputControlStatesOptions, TInputControlState } from './types'
import type { IComponentViewOptions } from '../component-view'
import { TComponentView } from '../component-view'
import { resolveState } from '../../common/resolve-state'

/**
 * База для текстовых инпутов.
 *
 * Наследует:
 * - интерактивность (disabled/focused)
 * - значение `value: string` (commit + input)
 * - name
 *
 * Добавляет простые свойства: readonly/required/invalid/state.
 * Добавляет loading через TLoadingState (без автоматического disabled).
 */
export default class TInputControl<
	TValue = string,
	TProps extends IInputControlProps<TValue> = IInputControlProps<TValue>,
	TEvents extends TInputControlEvents<TValue> = TInputControlEvents<TValue>,
	TStates extends TInputControlStatesOptions<TValue> = TInputControlStatesOptions<TValue>,
> extends TValueControl<TValue, TProps, TEvents> {
	static defaultValues: Partial<IInputControlProps<any>> = {
		...TValueControl.defaultValues,
		readonly: false,
		required: false,
		invalid: false,
		state: 'normal',
		loading: false,
	}

	protected _readonly: boolean
	protected _required: boolean
	protected _invalid: boolean
	protected _state: TInputControlState
	protected _loadingState: ILoadingState<any>

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		// Простые свойства
		this._readonly = props.readonly ?? (TInputControl.defaultValues.readonly as boolean)
		this._required = props.required ?? (TInputControl.defaultValues.required as boolean)
		this._invalid = props.invalid ?? (TInputControl.defaultValues.invalid as boolean)
		this._state = props.state ?? (TInputControl.defaultValues.state as TInputControlState)

		// Инвариант: invalid=true -> state='error'
		if (this._invalid && this._state !== 'error') {
			this._state = 'error'
		}

		// Loading через TLoadingState БЕЗ автоматического disabled
		const loadingInitial = states?.loading
			? undefined
			: {
					shouldDisable: false, // НЕ делаем disabled при loading для input
					createSpinner: undefined, // Spinner создается на уровне UI
				}

		this._loadingState = resolveState<ILoadingState<any>, boolean | any>(
			states?.loading,
			TLoadingState,
			loadingInitial,
		)

		// Устанавливаем начальное значение loading из props
		if (props.loading !== undefined) {
			this._loadingState.loading = props.loading
		}

		this._loadingState.events.on('change', (value) => {
			this.events.emit('change:loading', value.loading)
		})
	}

	get readonly(): boolean {
		return this._readonly
	}
	set readonly(value: boolean) {
		if (this._readonly === value) return
		this._readonly = value
		this.events.emit('change:readonly', value)
	}

	get required(): boolean {
		return this._required
	}
	set required(value: boolean) {
		if (this._required === value) return
		this._required = value
		this.events.emit('change:required', value)
	}

	get invalid(): boolean {
		return this._invalid
	}
	set invalid(value: boolean) {
		if (this._invalid === value) return
		this._invalid = value

		// Автоматически устанавливаем state = 'error' при invalid = true
		if (value && this._state !== 'error') {
			this._state = 'error'
			this.events.emit('change:state', this._state)
		}

		this.events.emit('change:invalid', value)
	}

	get state(): TInputControlState {
		return this._state
	}
	set state(value: TInputControlState) {
		if (this._state === value) return
		this._state = value
		this.events.emit('change:state', value)
	}

	get loadingState(): ILoadingState<any> {
		return this._loadingState
	}

	get loading(): boolean {
		return this._loadingState.loading
	}
	set loading(value: boolean) {
		this._loadingState.loading = value
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			readonly: this._readonly,
			required: this._required,
			invalid: this._invalid,
			state: this._state as any,
			loading: this.loading,
		} as TProps
	}
}
