import { describe, it, expect, vi } from 'vitest'
import { TInput } from '../components/input'

describe('TInput', () => {
	it('создаётся через { props } и через plain props', () => {
		const a = new TInput({ props: { value: 'hello', readonly: true, required: true } })
		expect(a.value).toBe('hello')
		expect(a.readonly).toBe(true)
		expect(a.required).toBe(true)
		expect(a.classes.toArray()).toContain('s-input')

		const b = new TInput({ value: 'world', readonly: false })
		expect(b.value).toBe('world')
		expect(b.readonly).toBe(false)
	})

	it('baseClass и модификаторы классов', () => {
		const input = new TInput()

		expect(input.classes.toArray()).toContain('s-input')

		input.variant = 'accent'
		expect(input.classes.toArray()).toContain('s-input--accent')

		input.size = 'lg'
		expect(input.classes.toArray()).toContain('s-input--size-lg')

		input.readonly = true
		expect(input.classes.toArray()).toContain('s-input--readonly')

		input.required = true
		expect(input.classes.toArray()).toContain('s-input--required')

	})

	it('value setter эмитит change:value и input:value', () => {
		const input = new TInput({ value: 'a' })
		const changeHandler = vi.fn()
		const inputHandler = vi.fn()
		input.events.on('change:value', changeHandler)
		input.events.on('input:value', inputHandler)

		input.value = 'b'
		expect(changeHandler).toHaveBeenCalledWith({ newValue: 'b', oldValue: 'a' })
		expect(inputHandler).toHaveBeenCalledWith({ newValue: 'b', oldValue: 'a' })
		expect(input.value).toBe('b')

		input.value = 'c'
		expect(inputHandler).toHaveBeenNthCalledWith(2, { newValue: 'c', oldValue: 'b' })
		expect(input.value).toBe('c')
	})

	it('сеттеры эмитят change:* события для всех inherited свойств', () => {
		const input = new TInput()
		const readonly = vi.fn()
		const required = vi.fn()
		const disabled = vi.fn()
		const focused = vi.fn()
		const name = vi.fn()

		input.events.on('change:readonly', readonly)
		input.events.on('change:required', required)
		input.events.on('change:disabled', disabled)
		input.events.on('change:focused', focused)
		input.events.on('change:name', name)

		input.readonly = true
		expect(readonly).toHaveBeenCalledWith(true)

		input.required = true
		expect(required).toHaveBeenCalledWith(true)

		input.disabled = true
		expect(disabled).toHaveBeenCalledWith(true)

		input.focused = true
		expect(focused).toHaveBeenCalledWith(true)

		input.name = 'field'
		expect(name).toHaveBeenCalledWith('field')
	})

	it('getProps возвращает все inherited props', () => {
		const input = new TInput({
			props: {
				value: 'test',
				name: 'email',
				disabled: true,
				focused: false,
				readonly: false,
				required: true,
				variant: 'accent',
				size: 'lg',
				visible: false,
				rendered: true,
			},
		})

		const props = input.getProps()
		expect(props).toMatchObject({
			value: 'test',
			name: 'email',
			disabled: true,
			focused: false,
			readonly: false,
			required: true,
			variant: 'accent',
			size: 'lg',
			visible: false,
			rendered: true,
		})
	})

	it('toJSON эквивалентен getProps', () => {
		const input = new TInput({ value: 'x', readonly: true })
		expect(input.toJSON()).toEqual(input.getProps())
	})

	it('show/hide управляют visible', () => {
		const input = new TInput({ visible: false })
		expect(input.visible).toBe(false)

		input.show()
		expect(input.visible).toBe(true)

		input.hide()
		expect(input.visible).toBe(false)
	})

	it('assign обновляет несколько свойств разом', () => {
		const input = new TInput({ value: 'a', readonly: false })
		input.assign({ value: 'b', readonly: true })
		expect(input.value).toBe('b')
		expect(input.readonly).toBe(true)
	})

})
