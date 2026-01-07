import { describe, it, expect, vi } from 'vitest'
import { TStylable } from '../base/stylable'
import type { IStylableProps } from '../base/stylable'
import { TSizeState } from '../base/states'

describe('TStylable', () => {
	it('size и variant выставляются и эмитят события', () => {
		const stylable = new TStylable<IStylableProps>({ size: 'normal', variant: 'normal' })
		const sizeHandler = vi.fn()
		const variantHandler = vi.fn()
		stylable.events.on('change:size', sizeHandler)
		stylable.events.on('change:variant', variantHandler)

		stylable.size = 'xl'
		expect(sizeHandler).toHaveBeenCalledWith('xl')
		expect(stylable.classes).toContain('s-presentable--size-xl')

		stylable.variant = 'primary'
		expect(variantHandler).toHaveBeenCalledWith('primary')
		expect(stylable.classes).toContain('s-presentable--primary')
	})

	it('getProps отражает size и variant', () => {
		const stylable = new TStylable<IStylableProps>({
			props: { size: 'lg', variant: 'primary' },
			baseClass: 's-test',
		})
		expect(stylable.getProps()).toMatchObject({ size: 'lg', variant: 'primary' })
	})

	it('states.size позволяет подменить size-state и влияет на classes', () => {
		class TCustomSizeState extends TSizeState {
			override getClass(): string[] {
				return [`${this.baseClass}--size-custom`]
			}
		}

		const stylable = new TStylable<IStylableProps>({
			props: { size: 'xl' },
			baseClass: 's-test',
			states: { size: TCustomSizeState },
		})

		expect(stylable.classes).toContain('s-test--size-custom')
	})
})
