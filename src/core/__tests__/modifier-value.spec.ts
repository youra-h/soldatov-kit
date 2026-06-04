import { describe, it, expect, vi } from 'vitest'
import { TClasses } from '../common/classes'

describe('TClasses', () => {
	it('toArray возвращает base + statics + dynamics', () => {
		const c = new TClasses('s-test', ['static1'])
		expect(c.toArray()).toEqual(['s-test', 'static1'])

		c.add('--mod', true)
		expect(c.toArray()).toContain('s-test--mod')

		c.add(() => 's-dynamic')
		expect(c.toArray()).toContain('s-dynamic')
	})

	it('add/remove эмитят change и управляют статическими классами', () => {
		const c = new TClasses('s-test')
		const handler = vi.fn()
		c.events.on('change', handler)

		c.add('--x', true)
		expect(c.toArray()).toContain('s-test--x')
		expect(handler).toHaveBeenCalledTimes(1)

		c.remove('--x', true)
		expect(c.toArray()).not.toContain('s-test--x')
		expect(handler).toHaveBeenCalledTimes(2)

		// повторное удаление не эмитит change
		c.remove('--x', true)
		expect(handler).toHaveBeenCalledTimes(2)
	})

	it('toggle управляет классом по булевому значению', () => {
		const c = new TClasses('s-test')
		c.toggle('--active', true)
		expect(c.toArray()).toContain('s-test--active')

		c.toggle('--active', false)
		expect(c.toArray()).not.toContain('s-test--active')
	})

	it('swapClass меняет один класс на другой', () => {
		const c = new TClasses('s-test')
		c.add('--size-normal', true)
		expect(c.toArray()).toContain('s-test--size-normal')

		c.swapClass({ oldClass: '--size-normal', newClass: '--size-xl' })
		expect(c.toArray()).toContain('s-test--size-xl')
		expect(c.toArray()).not.toContain('s-test--size-normal')
	})

	it('swap меняет класс по prefix+value', () => {
		const c = new TClasses('s-test')
		c.add('--normal', true)

		c.swap({ prefix: '--', oldValue: 'normal', newValue: 'accent' })
		expect(c.toArray()).toContain('s-test--accent')
		expect(c.toArray()).not.toContain('s-test--normal')
	})

	it('setBase обновляет базовый класс и эмитит change', () => {
		const c = new TClasses('a')
		const handler = vi.fn()
		c.events.on('change', handler)

		c.setBase('b')
		expect(c.base).toBe('b')
		expect(handler).toHaveBeenCalledTimes(1)

		// тот же базовый — change не эмитится
		c.setBase('b')
		expect(handler).toHaveBeenCalledTimes(1)
	})
})
