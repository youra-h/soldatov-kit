import { AbstractControlValueItem } from './control-value-item.class'
import { type IControlInput, type TControlInputState, TControlInput } from '../../control-input'
import type { TComponentVariant } from '../../../common/types'
import { TSpinner } from '../../spinner'
import type { TObjectProps } from '../../object'

/**
 * Абстрактный элемент коллекции для UI-контролов.
 * Наследники должны расширять assign и могут добавлять свои поля.
 */
export abstract class AbstractControlInputItem<
		TControlType extends TControlInput<any> = TControlInput<any>,
	>
	extends AbstractControlValueItem<TControlType>
	implements IControlInput
{
	constructor(control?: TControlType) {
		super(control ?? (TControlInput.create() as TControlType))
	}
	is?: Object | undefined
	show(): void {
		throw new Error('Method not implemented.')
	}
	beforeShow(): boolean {
		throw new Error('Method not implemented.')
	}
	afterShow(): void {
		throw new Error('Method not implemented.')
	}
	hide(): void {
		throw new Error('Method not implemented.')
	}
	beforeHide(): boolean {
		throw new Error('Method not implemented.')
	}
	afterHide(): void {
		throw new Error('Method not implemented.')
	}
	classes?: string[] | undefined
	getProps(): TObjectProps {
		throw new Error('Method not implemented.')
	}

	get variant(): TComponentVariant {
		return this._control.variant
	}

	set variant(value: TComponentVariant) {
		this._control.variant = value
	}

	get readonly(): boolean {
		return this._control.readonly
	}

	set readonly(value: boolean) {
		this._control.readonly = value
	}

	get required(): boolean {
		return this._control.required
	}

	set required(value: boolean) {
		this._control.required = value
	}

	get invalid(): boolean {
		return this._control.invalid
	}

	set invalid(value: boolean) {
		this._control.invalid = value
	}

	get state(): TControlInputState {
		return this._control.state
	}

	set state(value: TControlInputState) {
		this._control.state = value
	}

	get loading(): boolean {
		return this._control.loading
	}

	set loading(value: boolean) {
		this._control.loading = value
	}

	get spinner(): TSpinner | undefined {
		return this._control.spinner
	}

	set spinner(value: TSpinner | undefined) {
		this._control.spinner = value
	}
}
