import { describe, it, expect, beforeEach } from 'vitest'
import TButton from '../classes/button/button.class'
import { TIcon } from '../classes/icon'
import { TSpinner } from '../classes/spinner'

describe('TButton', () => {
	let btn: TButton
	beforeEach(() => {
		btn = TButton.create()
	})

	it('устанавливает значения по умолчанию', () => {
		expect(btn.variant).toBe(TButton.defaultValues.variant)
		expect(btn.appearance).toBe(TButton.defaultValues.appearance)
		expect(btn.icon).toBeUndefined()
		expect(btn.loading).toBe(TButton.defaultValues.loading)
		expect(btn.tag).toBe(TButton.defaultValues.tag)
	})

	it('устанавливает значения через props', () => {
		const icon = new TIcon({ props: { tag: 'my-icon' } })
		const spinner = new TSpinner({ props: { size: 'lg' } })
		const b = new TButton({
			props: {
				variant: 'primary',
				appearance: 'outlined',
				icon,
				loading: true,
				spinner,
				tag: 'a',
			},
		})
		expect(b.variant).toBe('primary')
		expect(b.appearance).toBe('outlined')
		expect(b.icon).toBe(icon)
		expect(b.loading).toBe(true)
		expect(b.spinner).toBe(spinner)
		expect(b.tag).toBe('a')
	})

	it('getProps возвращает все свойства', () => {
		const icon = new TIcon({ props: { tag: 'i' } })
		const b = new TButton({ props: { appearance: 'outlined', icon } })
		const props = b.getProps()
		expect(props.variant).toBe('normal')
		expect(props.appearance).toBe('outlined')
		expect(props.icon).toBe(icon)
	})

	it('variant, appearance, loading сеттеры работают', () => {
		btn.variant = 'danger'
		expect(btn.variant).toBe('danger')
		btn.appearance = 'outlined'
		expect(btn.appearance).toBe('outlined')
		btn.loading = true
		expect(btn.loading).toBe(true)
	})

	it('icon сеттер создает экземпляр TIcon если передан объект', () => {
		btn.icon = { tag: 'test' } as any
		expect(btn.icon).toBeInstanceOf(TIcon)
		expect(btn.icon?.tag).toBe('test')
	})

	it('spinner создается автоматически при обращении', () => {
		const b = TButton.create()
		expect(b.spinner).toBeInstanceOf(TSpinner)
	})

	it('classes содержит baseClass, внешний вид и вариант', () => {
		btn.variant = 'primary'
		btn.appearance = 'outlined'
		const classes = btn.classes
		expect(classes.some((cls) => cls.includes('s-button'))).toBe(true)
		expect(classes.some((cls) => cls.includes('outlined'))).toBe(true)
		expect(classes.some((cls) => cls.includes('primary'))).toBe(true)
	})
})
