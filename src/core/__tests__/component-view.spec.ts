import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TComponentView } from '../base/component-view'
import type { IComponentViewProps } from '../base/component-view'
import { TVisibilityState } from '../common/states'
import type { IVisibilityState } from '../common/states'
import { TStateUnit } from '../common/state-unit'

describe('TComponentView', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('принимает { props } корректно', () => {
		const p = new TComponentView({ props: { id: 'x', tag: 'span', visible: false } })
		expect(p.id).toBe('x')
		expect(p.tag).toBe('span')
		expect(p.visible).toBe(false)
		expect(p.classes.toArray()).toContain(TComponentView.baseClass)
	})

	it('принимает "голые" props без ключа props', () => {
		const p = new TComponentView({ id: 'x', tag: 'section' })
		expect(p.id).toBe('x')
		expect(p.tag).toBe('section')
		expect(p.classes.toArray()).toContain(TComponentView.baseClass)
	})

	it('getProps возвращает бизнес-свойства (без baseClass/classes)', () => {
		const p = new TComponentView<IComponentViewProps>({
			id: 123,
			tag: 'div',
			visible: true,
		})
		const props = p.getProps() as IComponentViewProps
		expect(props.id).toBe(123)
		expect(props.tag).toBe('div')
		expect(props.visible).toBe(true)
		// baseClass, classes больше не сериализуются
		expect(props).not.toHaveProperty('baseClass')
		expect(props).not.toHaveProperty('classes')
	})

	it('create создаёт инстанс и прокидывает id', () => {
		const p = TComponentView.create({ id: 'c' })
		expect(p).toBeInstanceOf(TComponentView)
		expect(p.id).toBe('c')
	})

	it('show/hide эмитят события и меняют visible', () => {
		const p = new TComponentView({ visible: false })
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
		const p = new TComponentView({ visible: false })
		const show = vi.spyOn(p as any, 'show')
		const hide = vi.spyOn(p as any, 'hide')

		p.visible = true
		expect(show).toHaveBeenCalled()
		p.visible = false
		expect(hide).toHaveBeenCalled()
	})

	it('tag/classes эмитят change:*', () => {
		const p = new TComponentView()
		const tagHandler = vi.fn()
		const classesHandler = vi.fn()
		p.events.on('change:tag', tagHandler)
		p.events.on('change:classes', classesHandler)

		p.tag = 'section'
		expect(tagHandler).toHaveBeenCalledWith('section')
		;(p.classes as any).add('x', false)
		expect(classesHandler).toHaveBeenCalled()
	})

	it('toJSON сериализует getProps()', () => {
		const p = new TComponentView({ id: 'x', tag: 'span' })
		expect(p.toJSON()).toEqual(p.getProps())
	})

	it('states позволяет передавать инстансы или конструкторы для visibility-state', () => {
		const log: string[] = []

		class TLoggedVisibilityState
			extends TStateUnit<boolean>
			implements IVisibilityState
		{
			constructor({ initial }: { initial: boolean }) {
				super({ initial })
				this.events.on('change', (payload: any) => {
					if (payload.newValue) {
						log.push('state:value=true')
					}
				})
			}

			show(): void {
				this.value = true
			}

			hide(): void {
				this.value = false
			}
		}

		// 1) Передаём готовые инстансы
		const instanceVisible = new TLoggedVisibilityState({ initial: false })
		const instanceRendered = new TVisibilityState({ initial: true })

		const p1 = new TComponentView({
			props: { visible: false },
			states: { rendered: instanceRendered, visible: instanceVisible },
		})
		p1.events.on('change:visible', (value) => {
			log.push(`component-view:change:visible=${value}`)
		})
		p1.visible = true

		expect(log).toContain('state:value=true')
		expect(log).toContain('component-view:change:visible=true')

	})

	it('states.rendered доступен через instance.states и setResolver меняет возвращаемое значение', () => {
		const c = new TComponentView({ rendered: true })

		expect(c.states.rendered).toBeDefined()
		expect(c.rendered).toBe(true)

		// Резольвер всегда возвращает false, игнорируя реальное значение
		c.states.rendered.setResolver(() => false)

		expect(c.rendered).toBe(false) // резольвер переопределил
		expect(c.states.rendered.rawValue).toBe(true) // сырое значение не изменилось
	})

	it('states.visible доступен через instance.states и setResolver меняет возвращаемое значение', () => {
		const c = new TComponentView({ visible: true })

		expect(c.states.visible).toBeDefined()
		expect(c.visible).toBe(true)

		c.states.visible.setResolver(() => false)

		expect(c.visible).toBe(false)
		expect(c.states.visible.rawValue).toBe(true)
	})
})
