import { describe, it, expect, vi, beforeEach } from 'vitest'
import TComponent from '../classes/component/component.class'

describe('TComponent', () => {
	let comp: TComponent<any>
	beforeEach(() => {
		comp = new TComponent()
	})

	it('устанавливает значения по умолчанию', () => {
		expect(comp.id).toBe(TComponent.defaultValues.id)
		expect(comp.tag).toBe(TComponent.defaultValues.tag)
		expect(comp.visible).toBe(TComponent.defaultValues.visible)
		expect(comp.hidden).toBe(TComponent.defaultValues.hidden)
		expect(comp.classes).toContain('s-component')
	})

	it('устанавливает значения через props', () => {
		const c = new TComponent({
			props: { id: 'x', tag: 'span', visible: false, hidden: true },
			baseClass: 'my-cmp',
		})
		expect(c.id).toBe('x')
		expect(c.tag).toBe('span')
		expect(c.visible).toBe(false)
		expect(c.hidden).toBe(true)
		expect(c.classes).toContain('my-cmp')
	})

	it('getProps возвращает все свойства', () => {
		const c = new TComponent({
			props: { id: 123, tag: 'section', visible: false, hidden: true },
		})
		const props = c.getProps()
		expect(props.id).toBe(123)
		expect(props.tag).toBe('section')
		expect(props.visible).toBe(false)
		expect(props.hidden).toBe(true)
	})

	it('show вызывает beforeShow, emitWithResult, меняет visible и вызывает события', () => {
		const beforeShow = vi.spyOn(comp, 'beforeShow').mockReturnValue(true)
		const emitWithResult = vi.spyOn(comp, 'emitWithResult').mockReturnValue(true)
		const showHandler = vi.fn()
		const visibleHandler = vi.fn()
		comp.on('show', showHandler)
		comp.on('visible', visibleHandler)
		comp.show()
		expect(beforeShow).toHaveBeenCalled()
		expect(emitWithResult).toHaveBeenCalledWith('beforeShow')
		expect(comp.visible).toBe(true)
		expect(showHandler).toHaveBeenCalled()
		expect(visibleHandler).toHaveBeenCalledWith(true)
	})

	it('hide вызывает beforeHide, emitWithResult, меняет visible и вызывает события', () => {
		const beforeHide = vi.spyOn(comp, 'beforeHide').mockReturnValue(true)
		const emitWithResult = vi.spyOn(comp, 'emitWithResult').mockReturnValue(true)
		const hideHandler = vi.fn()
		const visibleHandler = vi.fn()
		comp.on('hide', hideHandler)
		comp.on('visible', visibleHandler)
		comp.hide()
		expect(beforeHide).toHaveBeenCalled()
		expect(emitWithResult).toHaveBeenCalledWith('beforeHide')
		expect(comp.visible).toBe(false)
		expect(hideHandler).toHaveBeenCalled()
		expect(visibleHandler).toHaveBeenCalledWith(false)
	})

	it('visible=true вызывает show, visible=false вызывает hide', () => {
		const show = vi.spyOn(comp, 'show')
		const hide = vi.spyOn(comp, 'hide')
		comp.visible = true
		expect(show).toHaveBeenCalled()
		comp.visible = false
		expect(hide).toHaveBeenCalled()
	})

	it('hidden сеттер меняет _hidden', () => {
		comp.hidden = true
		expect(comp.hidden).toBe(true)
		comp.hidden = false
		expect(comp.hidden).toBe(false)
	})

	it('tag сеттер меняет _tag', () => {
		comp.tag = 'section'
		expect(comp.tag).toBe('section')
	})

	it('isHidden и isVisibility возвращают корректные значения', () => {
		comp.hidden = false
		comp.visible = true
		expect(comp.isHidden).toBe(true)
		expect(comp.isVisibility).toBe(true)
		comp.hidden = true
		comp.visible = false
		expect(comp.isHidden).toBe(false)
		expect(comp.isVisibility).toBe(true)
	})
})
