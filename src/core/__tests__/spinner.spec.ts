import { describe, it, expect } from 'vitest'
import { TSpinner } from '../components/spinner'
import type { ISpinnerProps } from '../components/spinner'

describe('TSpinner', () => {
	it('создаётся через { props }, через plain props и с override baseClass', () => {
		const a = new TSpinner({ props: { size: 'xl', variant: 'warning', borderWidth: 2 } })
		expect(a.size).toBe('xl')
		expect(a.variant).toBe('warning')
		expect(a.borderWidth).toBe(2)
		expect(a.classes).toContain('s-spinner')
		expect(a.classes).toContain('s-spinner--size-xl')
		expect(a.classes).toContain('s-spinner--warning')

		const b = new TSpinner({ size: 'normal', variant: 'primary' })
		expect(b.classes).toContain('s-spinner')
		// size=normal исключён -> size modifier отсутствует
		expect(b.classes).not.toContain('s-spinner--size-normal')
		expect(b.classes).toContain('s-spinner--primary')

		const c = new TSpinner({
			props: { size: 'xl', variant: 'success' },
			renderConfig: { baseClass: 's-test-spinner' },
		})
		expect(c.classes).toContain('s-test-spinner')
		expect(c.classes).toContain('s-test-spinner--size-xl')
		expect(c.classes).toContain('s-test-spinner--success')
	})

	it('смена size/variant меняет classes', () => {
		const s = new TSpinner({ size: 'normal', variant: 'primary' })
		expect(s.classes).toContain('s-spinner--primary')
		expect(s.classes).not.toContain('s-spinner--warning')

		s.variant = 'warning'
		expect(s.classes).toContain('s-spinner--warning')
		expect(s.classes).not.toContain('s-spinner--primary')

		s.size = 'xl'
		expect(s.classes).toContain('s-spinner--size-xl')
	})

	it('styles отражают рассчитанный borderWidth при auto', () => {
		const s = new TSpinner({ size: 'normal', borderWidth: 'auto' })
		expect(s.borderWidth).toBe(1)
		expect(s.styles['--spinner-border-width']).toBe('1px')

		s.size = 'xl'
		expect(s.borderWidth).toBe(2)
		expect(s.styles['--spinner-border-width']).toBe('2px')
	})

	it('getProps/toJSON отражают size/variant/borderWidth', () => {
		const s = new TSpinner({
			size: 'xl',
			variant: 'success',
			borderWidth: 'auto',
		})
		const props = s.getProps()
		expect(props).toMatchObject({ size: 'xl', variant: 'success', borderWidth: 'auto' })
		expect(s.toJSON()).toEqual(props)
	})
})
