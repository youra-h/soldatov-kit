import { describe, it, expect, vi, beforeEach } from 'vitest'
import TControlValue from '../classes/control-value/control-value.class'

describe('TControlValue', () => {
	let ctrl: TControlValue<any>
	beforeEach(() => {
		ctrl = TControlValue.create()
	})

	it('устанавливает значения по умолчанию', () => {
		expect(ctrl.value).toBe(TControlValue.defaultValues.value)
	})

	it('устанавливает значения через props', () => {
		const c = new TControlValue({ props: { value: 123 } })
		expect(c.value).toBe(123)
	})

	it('getProps возвращает value', () => {
		const c = new TControlValue({ props: { value: 'abc' } })
		const props = c.getProps()
		expect(props.value).toBe('abc')
	})

	it('value сеттер вызывает событие changeValue', () => {
		const handler = vi.fn()
		ctrl.on('changeValue', handler)
		ctrl.value = 'new value'
		expect(handler).toHaveBeenCalledWith('new value')
	})

	it('value сеттер не вызывает событие если значение не меняется', () => {
		const handler = vi.fn()
		ctrl.on('changeValue', handler)
		ctrl.value = ctrl.value
		expect(handler).not.toHaveBeenCalled()
	})
})
