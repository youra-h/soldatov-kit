import { describe, it, expect } from 'vitest'
import { TButton } from '../components/button'
import { TIcon } from '../components/icon'
import { TSpinner } from '../components/spinner'
import type { IButtonProps } from '../components/button'

describe('TButton', () => {
	it('создаётся через { props }, через plain props и с override baseClass', () => {
		const a = new TButton({ props: { text: 'button 1' } })
		expect(a.text).toBe('button 1')
		expect(a.classes).toContain('s-button')

		const b = new TButton({ text: 'button 2' })
		expect(b.text).toBe('button 2')

		const c = new TButton({ props: { text: 'x' }, baseClass: 's-btn' })
		expect(c.classes).toContain('s-btn')
	})

	it('classes меняются при смене variant/size/appearance', () => {
		const btn = new TButton({ baseClass: 's-btn' })

		btn.variant = 'primary'
		expect(btn.classes).toContain('s-btn--primary')

		btn.size = 'xl'
		expect(btn.classes).toContain('s-btn--size-xl')

		btn.appearance = 'plain'
		expect(btn.classes).toContain('s-btn--plain')
	})

	it('icon: принимает инстанс и создаёт через getInstance из объекта/тэга; синхронизирует size', () => {
		const btn = new TButton({ size: 'normal' })

		const icon1 = new TIcon({ tag: 'i1', size: 'lg' })
		btn.icon = icon1
		expect(btn.icon).toBe(icon1)
		// сеттер кнопки должен привести размер иконки к размеру кнопки
		expect(btn.icon!.size).toBe('normal')

		btn.icon = TIcon.getInstance({ tag: 'i2', size: 'xl' })
		expect(btn.icon).toBeInstanceOf(TIcon)
		expect(btn.icon!.size).toBe('normal')

		// размер кнопки меняется -> иконка синхронизируется через обработчик change:size
		btn.size = 'xl'
		expect(btn.icon!.size).toBe('xl')
	})

	it('spinner: создаётся лениво и синхронизирует size/variant от кнопки', () => {
		const btn = new TButton({ size: 'normal', variant: 'normal' })

		btn.variant = 'primary'
		const sp = btn.spinner
		expect(sp).toBeInstanceOf(TSpinner)
		expect(sp!.variant).toBe('primary')
		expect(sp!.size).toBe('normal')

		btn.size = 'xl'
		expect(sp!.size).toBe('xl')
	})

	it('getProps/toJSON отражают ключевые props', () => {
		const btn = new TButton({
			props: {
				text: 't',
				variant: 'secondary',
				size: 'lg',
				appearance: 'outlined',
				loading: true,
			},
			baseClass: 's-btn',
		} as any)

		const props = btn.getProps()
		expect(props).toMatchObject({
			text: 't',
			variant: 'secondary',
			size: 'lg',
			appearance: 'outlined',
			loading: true,
		})
		expect(btn.toJSON()).toEqual(props)
	})
})
