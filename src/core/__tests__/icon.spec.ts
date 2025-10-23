import { describe, it, expect, beforeEach } from 'vitest'
import TIcon from '../classes/icon/icon.class'

describe('TIcon', () => {
	let icon: TIcon
	beforeEach(() => {
		icon = new TIcon({})
	})

	it('устанавливает значения по умолчанию', () => {
		expect(icon.size).toBe(TIcon.defaultValues.size)
		expect(icon.tag).toBe(TIcon.defaultValues.tag)
		expect(icon.width).toBeUndefined()
		expect(icon.height).toBeUndefined()
	})

	it('устанавливает значения через props', () => {
		const c = new TIcon({ props: { size: 'lg', tag: 'my-icon', width: 24, height: 32 } })
		expect(c.size).toBe('lg')
		expect(c.tag).toBe('my-icon')
		expect(c.width).toBe(24)
		expect(c.height).toBe(32)
	})

	it('getProps возвращает все свойства', () => {
		const c = new TIcon({ props: { size: 'xl', width: 10, height: 20 } })
		const props = c.getProps()
		expect(props.size).toBe('xl')
		expect(props.width).toBe(10)
		expect(props.height).toBe(20)
	})

	it('size, width, height сеттеры работают', () => {
		icon.size = 'sm'
		expect(icon.size).toBe('sm')
		icon.width = 100
		expect(icon.width).toBe(100)
		icon.height = 200
		expect(icon.height).toBe(200)
	})

	it('classes содержит baseClass и класс размера', () => {
		icon.size = 'lg'
		const classes = icon.classes
		expect(classes.some((cls) => cls.includes('s-icon'))).toBe(true)
		expect(classes.some((cls) => cls.includes('size-lg'))).toBe(true)
	})

	it('getInstance возвращает существующий экземпляр или создает новый', () => {
		const i1 = new TIcon({ props: { tag: 'a' } })
		expect(TIcon.getInstance(i1)).toBe(i1)
		const i2 = TIcon.getInstance('b')
		expect(i2).toBeInstanceOf(TIcon)
		expect(i2.tag).toBe('b')
	})
})
