import { describe, it, expect, beforeEach } from 'vitest'
import TSpinner, { defaultValues } from '../classes/spinner/spinner.class'

describe('TSpinner', () => {
	let spinner: TSpinner
	beforeEach(() => {
		spinner = TSpinner.create()
	})

	it('устанавливает значения по умолчанию', () => {
		expect(spinner.size).toBe(defaultValues.size)
		expect(spinner.variant).toBe(defaultValues.variant)
		expect(spinner.tag).toBe(defaultValues.tag)
		expect(spinner.borderWidth).toBe(1)
	})

	it('устанавливает значения через props', () => {
		const s = new TSpinner({
			props: { size: 'xl', variant: 'danger', tag: 'div', borderWidth: 5 },
		})
		expect(s.size).toBe('xl')
		expect(s.variant).toBe('danger')
		expect(s.tag).toBe('div')
		expect(s.borderWidth).toBe(5)
	})

	it('getProps возвращает все свойства', () => {
		const s = new TSpinner({ props: { size: '2xl' } })
		const props = s.getProps()
		expect(props.size).toBe('2xl')
	})

	it('size, variant, borderWidth сеттеры работают', () => {
		spinner.size = 'lg'
		expect(spinner.size).toBe('lg')
		spinner.variant = 'success'
		expect(spinner.variant).toBe('success')
		spinner.borderWidth = 3
		expect(spinner.borderWidth).toBe(3)
	})

	it('borderWidth=auto рассчитывается в зависимости от размера', () => {
		spinner.size = 'xl'
		spinner.borderWidth = 'auto'
		expect(spinner.borderWidth).toBe(2)
		spinner.size = 'sm'
		expect(spinner.borderWidth).toBe(1)
	})

	it('classes содержит baseClass, размер и вариант', () => {
		spinner.size = 'lg'
		spinner.variant = 'primary'
		const classes = spinner.classes
		expect(classes.some((cls) => cls.includes('s-spinner'))).toBe(true)
		expect(classes.some((cls) => cls.includes('size-lg'))).toBe(true)
		expect(classes.some((cls) => cls.includes('primary'))).toBe(true)
	})

	it('styles содержит корректную толщину бордера', () => {
		spinner.borderWidth = 4
		expect(spinner.styles['--spinner-border-width']).toBe('4px')
	})
})
