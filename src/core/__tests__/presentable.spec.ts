import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TPresentable } from '../base/presentable'
import type { IPresentableProps } from '../base/presentable'

describe('TPresentable', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('принимает { props } и baseClass', () => {
		const p = new TPresentable({ props: { id: 'x', tag: 'span', visible: false }, baseClass: 'my' })
		expect(p.id).toBe('x')
		expect(p.tag).toBe('span')
		expect(p.visible).toBe(false)
		expect(p.classes).toContain('my')
	})

	it('принимает "голые" props без ключа props', () => {
		const p = new TPresentable({ id: 'x', tag: 'section', classes: ['a'], attrs: { role: 'x' } })
		expect(p.id).toBe('x')
		expect(p.tag).toBe('section')
		expect(p.classes).toContain(TPresentable.baseClass)
		expect(p.classes).toContain('a')
		expect(p.attrs).toEqual({ role: 'x' })
	})

	it('getProps возвращает все свойства (включая baseClass/classes/attrs)', () => {
		const p = new TPresentable<IPresentableProps>({
			id: 123,
			tag: 'div',
			visible: true,
			classes: ['x'],
			attrs: { a: 1 },
		})
		const props = p.getProps() as IPresentableProps
		expect(props.id).toBe(123)
		expect(props.tag).toBe('div')
		expect(props.visible).toBe(true)
		expect(props.baseClass).toBe(TPresentable.baseClass)
		expect(props.classes).toEqual(['x'])
		expect(props.attrs).toEqual({ a: 1 })
	})

	it('create создаёт инстанс и прокидывает id', () => {
		const p = TPresentable.create({ id: 'c' })
		expect(p).toBeInstanceOf(TPresentable)
		expect(p.id).toBe('c')
	})

	it('show/hide эмитят события и меняют visible', () => {
		const p = new TPresentable({ visible: false })
		const beforeShow = vi.spyOn(p as any, 'beforeShow').mockReturnValue(true)
		const beforeHide = vi.spyOn(p as any, 'beforeHide').mockReturnValue(true)
		const emitWithResult = vi.spyOn(p.events, 'emitWithResult').mockReturnValue(true)

		const showHandler = vi.fn()
		const hideHandler = vi.fn()
		const visibleHandler = vi.fn()
		p.events.on('show' as any, showHandler)
		p.events.on('hide' as any, hideHandler)
		p.events.on('change:visible', visibleHandler)

		p.show()
		expect(beforeShow).toHaveBeenCalled()
		expect(emitWithResult).toHaveBeenCalledWith('beforeShow')
		expect(p.visible).toBe(true)
		expect(showHandler).toHaveBeenCalled()
		expect(visibleHandler).toHaveBeenCalledWith(true)

		p.hide()
		expect(beforeHide).toHaveBeenCalled()
		expect(emitWithResult).toHaveBeenCalledWith('beforeHide')
		expect(p.visible).toBe(false)
		expect(hideHandler).toHaveBeenCalled()
		expect(visibleHandler).toHaveBeenCalledWith(false)
	})

	it('visible=true вызывает show, visible=false вызывает hide', () => {
		const p = new TPresentable({ visible: false })
		const show = vi.spyOn(p as any, 'show')
		const hide = vi.spyOn(p as any, 'hide')

		p.visible = true
		expect(show).toHaveBeenCalled()
		p.visible = false
		expect(hide).toHaveBeenCalled()
	})

	it('tag/attrs/setClasses эмитят change:*', () => {
		const p = new TPresentable()
		const tagHandler = vi.fn()
		const attrsHandler = vi.fn()
		const classesHandler = vi.fn()
		p.events.on('change:tag', tagHandler)
		p.events.on('change:attrs', attrsHandler)
		p.events.on('change:classes', classesHandler)

		p.tag = 'section'
		expect(tagHandler).toHaveBeenCalledWith('section')

		p.attrs = { a: 1 }
		expect(attrsHandler).toHaveBeenCalledWith({ a: 1 })

		p.setClasses(['x'])
		expect(classesHandler).toHaveBeenCalledWith(['x'])
	})

	it('toJSON сериализует getProps()', () => {
		const p = new TPresentable({ id: 'x', tag: 'span', classes: ['a'] })
		expect(p.toJSON()).toEqual(p.getProps())
	})
})
