import { describe, it, expect, vi, beforeEach } from 'vitest'
import TControl from '../classes/control/control.class'

describe('TControl', () => {
	let ctrl: TControl<any>
	beforeEach(() => {
		ctrl = TControl.create()
	})

	it('устанавливает значения по умолчанию', () => {
		expect(ctrl.text).toBe(TControl.defaultValues.text)
		expect(ctrl.disabled).toBe(TControl.defaultValues.disabled)
		expect(ctrl.focused).toBe(TControl.defaultValues.focused)
		expect(ctrl.size).toBe(TControl.defaultValues.size)
		expect(ctrl.name).toBe(ctrl.id.toString())
	})

	it('устанавливает значения через props', () => {
		const c = new TControl({
			props: { name: 'n', text: 't', disabled: true, focused: true, size: 'lg', id: 'id1' },
		})
		expect(c.name).toBe('n')
		expect(c.text).toBe('t')
		expect(c.disabled).toBe(true)
		expect(c.focused).toBe(true)
		expect(c.size).toBe('lg')
		expect(c.id).toBe('id1')
	})

	it('getProps возвращает все свойства', () => {
		const c = new TControl({
			props: { text: 'abc', disabled: true, focused: true, size: 'xl' },
		})
		const props = c.getProps()
		expect(props.text).toBe('abc')
		expect(props.disabled).toBe(true)
		expect(props.focused).toBe(true)
		expect(props.size).toBe('xl')
	})

	it('text сеттер вызывает событие changeText', () => {
		const handler = vi.fn()
		ctrl.on('changeText', handler)
		ctrl.text = 'new text'
		expect(handler).toHaveBeenCalledWith('new text')
	})

	it('disabled сеттер вызывает событие disabled', () => {
		const handler = vi.fn()
		ctrl.on('disabled', handler)
		ctrl.disabled = true
		expect(handler).toHaveBeenCalledWith(true)
	})

	it('focused сеттер вызывает событие focused', () => {
		const handler = vi.fn()
		ctrl.on('focused', handler)
		ctrl.focused = true
		expect(handler).toHaveBeenCalledWith(true)
	})

	it('size сеттер меняет _sizeHelper.value', () => {
		ctrl.size = 'lg'
		expect(ctrl.size).toBe('lg')
	})

	it('classes содержит класс размера', () => {
		ctrl.size = 'sm'
		expect(ctrl.classes.some((cls) => cls.includes('size-sm'))).toBe(true)
	})

	it('afterHide сбрасывает focused', () => {
		ctrl.focused = true
		ctrl.afterHide()
		expect(ctrl.focused).toBe(false)
	})
})
