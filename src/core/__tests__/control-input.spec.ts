import { describe, it, expect, vi, beforeEach } from 'vitest'
import TControlInput from '../classes/control-input/control-input.class'
import { TSpinner } from '../classes/spinner'

describe('TControlInput', () => {
	let ctrl: TControlInput<any>
	beforeEach(() => {
		ctrl = TControlInput.create()
	})

	it('устанавливает значения по умолчанию', () => {
		expect(ctrl.variant).toBe(TControlInput.defaultValues.variant)
		expect(ctrl.readonly).toBe(TControlInput.defaultValues.readonly)
		expect(ctrl.required).toBe(TControlInput.defaultValues.required)
		expect(ctrl.invalid).toBe(TControlInput.defaultValues.invalid)
		expect(ctrl.state).toBe(TControlInput.defaultValues.state)
		expect(ctrl.loading).toBe(TControlInput.defaultValues.loading)
	})

	it('устанавливает значения через props', () => {
		const c = new TControlInput({
			props: {
				variant: 'primary',
				readonly: true,
				required: true,
				invalid: true,
				state: 'error',
				loading: true,
			},
		})
		expect(c.variant).toBe('primary')
		expect(c.readonly).toBe(true)
		expect(c.required).toBe(true)
		expect(c.invalid).toBe(true)
		expect(c.state).toBe('error')
		expect(c.loading).toBe(true)
	})

	it('getProps возвращает все свойства', () => {
		const c = new TControlInput({
			props: {
				variant: 'danger',
				readonly: true,
				required: true,
				invalid: true,
				state: 'error',
				loading: true,
			},
		})
		const props = c.getProps()
		expect(props.variant).toBe('danger')
		expect(props.readonly).toBe(true)
		expect(props.required).toBe(true)
		expect(props.invalid).toBe(true)
		expect(props.state).toBe('error')
		expect(props.loading).toBe(true)
		expect(props.spinner).toBeInstanceOf(TSpinner)
	})

	it('variant сеттер меняет _variantHelper.value', () => {
		ctrl.variant = 'success'
		expect(ctrl.variant).toBe('success')
	})

	it('readonly, required, invalid, state, loading сеттеры работают', () => {
		ctrl.readonly = true
		expect(ctrl.readonly).toBe(true)
		ctrl.required = true
		expect(ctrl.required).toBe(true)
		ctrl.invalid = true
		expect(ctrl.invalid).toBe(true)
		ctrl.state = 'error'
		expect(ctrl.state).toBe('error')
		ctrl.loading = true
		expect(ctrl.loading).toBe(true)
	})

	it('invalid=true меняет state на error', () => {
		ctrl.state = 'normal'
		ctrl.invalid = true
		expect(ctrl.state).toBe('error')
	})

	it('spinner создается автоматически при обращении', () => {
		const c = TControlInput.create()
		expect(c.spinner).toBeInstanceOf(TSpinner)
	})

	it('classes содержит baseClass, размер и вариант', () => {
		ctrl.variant = 'primary'
		ctrl.size = 'lg'
		const classes = ctrl.classes
		expect(classes.some((cls) => cls.includes('s-control-input'))).toBe(true)
		expect(classes.some((cls) => cls.includes('size-lg'))).toBe(true)
		expect(classes.some((cls) => cls.includes('primary'))).toBe(true)
	})
})
