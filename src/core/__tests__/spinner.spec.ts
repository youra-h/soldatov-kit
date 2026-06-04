import { describe, it, expect } from 'vitest'
import { TSpinner } from '../components/spinner'

describe('TSpinner', () => {
	it('создаётся через { props } и через plain props', () => {
		const a = new TSpinner({ props: { size: 'xl', variant: 'caution', borderWidth: 2 } })
		expect(a.size).toBe('xl')
		expect(a.variant).toBe('caution')
		expect(a.borderWidth).toBe(2)
		expect(a.classes.toArray()).toContain('s-spinner')
		expect(a.classes.toArray()).toContain('s-spinner--size-xl')
		expect(a.classes.toArray()).toContain('s-spinner--caution')

		const b = new TSpinner({ size: 'normal', variant: 'accent' })
		expect(b.classes.toArray()).toContain('s-spinner')
		expect(b.classes.toArray()).toContain('s-spinner--size-normal')
		expect(b.classes.toArray()).toContain('s-spinner--accent')
	})

	it('смена size/variant меняет classes', () => {
		const s = new TSpinner({ size: 'normal', variant: 'accent' })
		expect(s.classes.toArray()).toContain('s-spinner--accent')
		expect(s.classes.toArray()).not.toContain('s-spinner--caution')

		s.variant = 'caution'
		expect(s.classes.toArray()).toContain('s-spinner--caution')
		expect(s.classes.toArray()).not.toContain('s-spinner--accent')

		s.size = 'xl'
		expect(s.classes.toArray()).toContain('s-spinner--size-xl')
	})

	it('getProps/toJSON отражают size/variant/borderWidth', () => {
		const s = new TSpinner({
			size: 'xl',
			variant: 'positive',
			borderWidth: 'auto',
		})
		const props = s.getProps()
		expect(props).toMatchObject({ size: 'xl', variant: 'positive', borderWidth: 'auto' })
		expect(s.toJSON()).toEqual(props)
	})
})
