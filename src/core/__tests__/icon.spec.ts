import { describe, it, expect } from 'vitest'
import { TIcon } from '../components/icon'

describe('TIcon', () => {
	it('создаётся через { props } и через plain props', () => {
		const a = new TIcon({ props: { tag: 'a', size: 'xl' } })
		expect(a.tag).toBe('a')
		expect(a.size).toBe('xl')
		expect(a.classes.toArray()).toContain('s-icon')
		expect(a.classes.toArray()).toContain('s-icon--size-xl')

		const b = new TIcon({ tag: 'b', size: 'lg' })
		expect(b.tag).toBe('b')
		expect(b.size).toBe('lg')
		expect(b.classes.toArray()).toContain('s-icon--size-lg')
	})

	it('смена size меняет classes (size modifier)', () => {
		const icon = new TIcon({ size: 'normal' })
		expect(icon.classes.toArray()).toContain('s-icon--size-normal')

		icon.size = 'xl'
		expect(icon.classes.toArray()).toContain('s-icon--size-xl')
		expect(icon.classes.toArray()).not.toContain('s-icon--size-normal')
	})

	it('width/height отражаются в getProps/toJSON', () => {
		const icon = new TIcon({ tag: 'x', width: 12, height: '16' })
		expect(icon.width).toBe(12)
		expect(icon.height).toBe('16')

		const props = icon.getProps()
		expect(props).toMatchObject({ tag: 'x', width: 12, height: '16' })
		expect(icon.toJSON()).toEqual(props)
	})

	it('getInstance: возвращает тот же инстанс / создаёт из props-объекта / создаёт из raw value', () => {
		const existing = new TIcon({ tag: 'existing', size: 'lg' })
		expect(TIcon.getInstance(existing)).toBe(existing)

		const fromProps = TIcon.getInstance({ tag: 'from-props', size: 'xl' })
		expect(fromProps).toBeInstanceOf(TIcon)
		expect(fromProps.tag).toBe('from-props')
		expect(fromProps.size).toBe('xl')

		const fromRaw = TIcon.getInstance('raw-tag')
		expect(fromRaw.tag).toBe('raw-tag')
	})

	it('IIconProps совместимы с create формы', () => {
		const icon = new TIcon({ props: { tag: 'z' } })
		expect(icon.tag).toBe('z')
	})
})
