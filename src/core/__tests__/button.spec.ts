import { describe, it, expect } from 'vitest'
import { TButton } from '../components/button'

describe('TButton', () => {
	it('создаётся через { props } и через plain props', () => {
		const a = new TButton({ props: { text: 'button 1' } })
		expect(a.text).toBe('button 1')
		expect(a.classes.toArray()).toContain('s-button')

		const b = new TButton({ text: 'button 2' })
		expect(b.text).toBe('button 2')

		const c = new TButton({ props: { text: 'x' } })
		expect(c.classes.toArray()).toContain('s-button')
	})

	it('classes меняются при смене variant/size/view', () => {
		const btn = new TButton()

		btn.variant = 'accent'
		expect(btn.classes.toArray()).toContain('s-button--accent')

		btn.size = 'xl'
		expect(btn.classes.toArray()).toContain('s-button--size-xl')

		btn.view = 'plain'
		expect(btn.classes.toArray()).toContain('s-button--a-plain')
	})

	it('getProps/toJSON отражают ключевые props', () => {
		const btn = new TButton({
			props: {
				text: 't',
				variant: 'accent',
				size: 'lg',
				view: 'outlined',
			},
		})

		const props = btn.getProps()
		expect(props).toMatchObject({
			text: 't',
			variant: 'accent',
			size: 'lg',
			view: 'outlined',
		})
		expect(btn.toJSON()).toEqual(props)
	})
})
