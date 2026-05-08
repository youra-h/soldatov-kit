import { describe, it, expect, vi } from 'vitest'
import { TStylable } from '../base/stylable'
import type { IStylableProps } from '../base/stylable'
import { TStateUnit } from '../common/state-unit'
import type { TComponentSize } from '../common/types'

describe('TStylable', () => {
	it('size и variant выставляются и эмитят события', () => {
		const stylable = new TStylable<IStylableProps>({ size: 'normal', variant: 'normal' })
		const sizeHandler = vi.fn()
		const variantHandler = vi.fn()
		stylable.events.on('change:size', sizeHandler)
		stylable.events.on('change:variant', variantHandler)

		stylable.size = 'xl'
		expect(sizeHandler).toHaveBeenCalledWith({ newValue: 'xl', oldValue: 'normal' })
		expect(stylable.classes.toArray()).toContain('s-component-view--size-xl')

		stylable.variant = 'accent'
		expect(variantHandler).toHaveBeenCalledWith({ newValue: 'accent', oldValue: 'normal' })
		expect(stylable.classes.toArray()).toContain('s-component-view--variant-accent')
	})

	it('getProps отражает size и variant', () => {
		const stylable = new TStylable<IStylableProps>({
			props: { size: 'lg', variant: 'accent' },
		})
		expect(stylable.getProps()).toMatchObject({ size: 'lg', variant: 'accent' })
	})

	it('states.size позволяет передать внешний TStateUnit и классы обновляются при его изменении', () => {
		const customSizeState = new TStateUnit<TComponentSize>('xl')

		const stylable = new TStylable<IStylableProps>({
			states: { size: customSizeState },
		})

		expect(stylable.size).toBe('xl')

		customSizeState.value = 'sm'
		expect(stylable.size).toBe('sm')
		expect(stylable.classes.toArray()).toContain('s-component-view--size-sm')
	})
})
