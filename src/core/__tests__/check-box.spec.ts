import { describe, it, expect, vi, beforeEach } from 'vitest'
import TCheckBox, { defaultValues } from '../classes/check-box/check-box.class'
import { TIcon } from '../classes/icon'

describe('TCheckBox', () => {
	let cb: TCheckBox<any>
	beforeEach(() => {
		cb = TCheckBox.create()
	})

	it('устанавливает значения по умолчанию', () => {
		expect(cb.value).toBe(defaultValues.value)
		expect(cb.indeterminate).toBe(defaultValues.indeterminate)
		expect(cb.plain).toBe(defaultValues.plain)
		expect(cb.icon).toBeUndefined()
		expect(cb.indeterminateIcon).toBeUndefined()
	})

	it('устанавливает значения через props', () => {
		const icon = new TIcon({ props: { tag: 'icon' } })
		const indIcon = new TIcon({ props: { tag: 'ind' } })
		const c = new TCheckBox({
			props: {
				value: true,
				indeterminate: true,
				plain: true,
				icon,
				indeterminateIcon: indIcon,
			},
		})
		expect(c.value).toBe(true)
		expect(c.indeterminate).toBe(true)
		expect(c.plain).toBe(true)
		expect(c.icon).toBe(icon)
		expect(c.indeterminateIcon).toBe(indIcon)
	})

	it('getProps возвращает все свойства', () => {
		const icon = new TIcon({ props: { tag: 'icon' } })
		const indIcon = new TIcon({ props: { tag: 'ind' } })
		const c = new TCheckBox({ props: { icon, indeterminateIcon: indIcon } })
		const props = c.getProps()
		expect(props.icon).toBe(icon)
		expect(props.indeterminateIcon).toBe(indIcon)
		expect(props.indeterminate).toBe(false)
		expect(props.plain).toBe(false)
	})

	it('value сеттер вызывает событие changeValue', () => {
		const handler = vi.fn()
		cb.on('changeValue', handler)
		cb.value = true
		expect(handler).toHaveBeenCalledWith(true)
	})

	it('indeterminate сеттер вызывает событие changeIndeterminate', () => {
		const handler = vi.fn()
		cb.on('changeIndeterminate', handler)
		cb.indeterminate = true
		expect(handler).toHaveBeenCalledWith(true)
	})

	it('plain, icon, indeterminateIcon сеттеры работают', () => {
		cb.plain = true
		expect(cb.plain).toBe(true)
		const icon = new TIcon({ props: { tag: 'icon' } })
		cb.icon = icon
		expect(cb.icon).toBe(icon)
		const indIcon = new TIcon({ props: { tag: 'ind' } })
		cb.indeterminateIcon = indIcon
		expect(cb.indeterminateIcon).toBe(indIcon)
	})

	it('classes содержит baseClass, indeterminate и plain', () => {
		cb.indeterminate = true
		cb.plain = true
		const classes = cb.classes
		expect(classes.some((cls) => cls.includes('s-check-box'))).toBe(true)
		expect(classes.some((cls) => cls.includes('indeterminate'))).toBe(true)
		expect(classes.some((cls) => cls.includes('plain'))).toBe(true)
	})

	it('change переключает состояние чекбокса и вызывает событие change', () => {
		const handler = vi.fn()
		cb.on('change', handler)
		cb.value = false
		cb.change()
		expect(cb.value).toBe(true)
		expect(handler).toHaveBeenCalledWith({ event: undefined, value: true })
		cb.change()
		expect(cb.value).toBe(false)
	})

	it('getAriaChecked возвращает корректные значения', () => {
		cb.value = true
		expect(cb.getAriaChecked()).toBe('true')
		cb.value = false
		expect(cb.getAriaChecked()).toBe('false')
		cb.indeterminate = true
		expect(cb.getAriaChecked()).toBe('mixed')
	})
})
