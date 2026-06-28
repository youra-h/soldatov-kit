import { describe, it, expect } from 'vitest'
import TSkeleton from '../components/skeleton/skeleton.class'
import type { TSkeletonShape, TSkeletonAnimation } from '../components/skeleton/types'

describe('TSkeleton', () => {
	it('should create with default values', () => {
		const skeleton = new TSkeleton()

		expect(skeleton.size).toBe('auto')
		expect(skeleton.variant).toBe('normal')
		expect(skeleton.shape).toBe('rounded')
		expect(skeleton.animation).toBe('pulse')
		expect(skeleton.width).toBe('auto')
		expect(skeleton.height).toBe('auto')
	})

	it('should create with custom props', () => {
		const skeleton = new TSkeleton({
			size: 'lg',
			variant: 'accent',
			shape: 'circle',
			animation: 'wave',
			width: 120,
			height: 60,
		})

		expect(skeleton.size).toBe('lg')
		expect(skeleton.variant).toBe('accent')
		expect(skeleton.shape).toBe('circle')
		expect(skeleton.animation).toBe('wave')
		expect(skeleton.width).toBe(120)
		expect(skeleton.height).toBe(60)
	})

	it('should change size', () => {
		const skeleton = new TSkeleton()

		expect(skeleton.size).toBe('auto')

		skeleton.size = 'xl'
		expect(skeleton.size).toBe('xl')
	})

	it('should change shape', () => {
		const skeleton = new TSkeleton()
		const shapes: TSkeletonShape[] = ['rect', 'rounded', 'circle']

		for (const shape of shapes) {
			skeleton.shape = shape
			expect(skeleton.shape).toBe(shape)
		}
	})

	it('should change animation', () => {
		const skeleton = new TSkeleton()
		const animations: TSkeletonAnimation[] = ['pulse', 'wave', 'none']

		for (const animation of animations) {
			skeleton.animation = animation
			expect(skeleton.animation).toBe(animation)
		}
	})

	it('should change width and height', () => {
		const skeleton = new TSkeleton()

		skeleton.width = 200
		expect(skeleton.width).toBe(200)

		skeleton.height = 100
		expect(skeleton.height).toBe(100)

		skeleton.width = '50%'
		expect(skeleton.width).toBe('50%')

		skeleton.height = 'auto'
		expect(skeleton.height).toBe('auto')
	})

	it('should emit events on property changes', () => {
		const skeleton = new TSkeleton()
		const events: string[] = []

		skeleton.events.on('change:size', () => events.push('size'))
		skeleton.events.on('change:shape', () => events.push('shape'))
		skeleton.events.on('change:animation', () => events.push('animation'))
		skeleton.events.on('change:width', () => events.push('width'))
		skeleton.events.on('change:height', () => events.push('height'))

		skeleton.size = 'sm'
		skeleton.shape = 'circle'
		skeleton.animation = 'wave'
		skeleton.width = 100
		skeleton.height = 50

		expect(events).toEqual(['size', 'shape', 'animation', 'width', 'height'])
	})

	it('should have base class', () => {
		const skeleton = new TSkeleton()
		expect(skeleton.classes.base).toBe('s-skeleton')
	})

	it('should have size class', () => {
		const skeleton = new TSkeleton()
		expect(skeleton.classes.has('--size-auto')).toBe(true)

		skeleton.size = 'lg'
		expect(skeleton.classes.has('--size-lg')).toBe(true)
		expect(skeleton.classes.has('--size-auto')).toBe(false)
	})

	it('should have shape class', () => {
		const skeleton = new TSkeleton()
		expect(skeleton.classes.has('--rounded')).toBe(true)

		skeleton.shape = 'rect'
		expect(skeleton.classes.has('--rect')).toBe(true)
		expect(skeleton.classes.has('--rounded')).toBe(false)
	})

	it('should have animation class', () => {
		const skeleton = new TSkeleton()
		expect(skeleton.classes.has('--pulse')).toBe(true)

		skeleton.animation = 'none'
		expect(skeleton.classes.has('--none')).toBe(true)
		expect(skeleton.classes.has('--pulse')).toBe(false)
	})
})
