import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TComponentView } from '../base/component-view'
import type { IComponentViewProps } from '../base/component-view'
import { TVisibilityState } from '../base/states'
import type { IVisibilityState, TVisibilityStateEvents } from '../base/states'
import { TEvented } from '../common/evented'

describe('TComponentView', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('принимает { props } и baseClass', () => {
		const p = new TComponentView({ props: { id: 'x', tag: 'span', visible: false }, baseClass: 'my' })
		expect(p.id).toBe('x')
		expect(p.tag).toBe('span')
		expect(p.visible).toBe(false)
		expect(p.classes).toContain('my')
	})

	it('принимает "голые" props без ключа props', () => {
		const p = new TComponentView({ id: 'x', tag: 'section', classes: ['a'], attrs: { role: 'x' } })
		expect(p.id).toBe('x')
		expect(p.tag).toBe('section')
		expect(p.classes).toContain(TComponentView.baseClass)
		expect(p.classes).toContain('a')
		expect(p.attrs).toEqual({ role: 'x' })
	})

	it('getProps возвращает все свойства (включая baseClass/classes/attrs)', () => {
		const p = new TComponentView<IComponentViewProps>({
			id: 123,
			tag: 'div',
			visible: true,
			classes: ['x'],
			attrs: { a: 1 },
		})
		const props = p.getProps() as IComponentViewProps
		expect(props.id).toBe(123)
		expect(props.tag).toBe('div')
		expect(props.visible).toBe(true)
		expect(props.baseClass).toBe(TComponentView.baseClass)
		expect(props.classes).toEqual(['x'])
		expect(props.attrs).toEqual({ a: 1 })
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

	it('tag/attrs/setClasses эмитят change:*', () => {
		const p = new TComponentView()
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
		const p = new TComponentView({ id: 'x', tag: 'span', classes: ['a'] })
		expect(p.toJSON()).toEqual(p.getProps())
	})

	it('states позволяет передавать инстансы или конструкторы для visibility-state', () => {
		const log: string[] = []

		class TLoggedVisibilityState implements IVisibilityState {
			public readonly events = new TEvented<TVisibilityStateEvents>()
			private _visible: boolean

			constructor(initial: boolean, private readonly _log: string[]) {
				this._visible = initial
			}

			get visible(): boolean {
				return this._visible
			}
			set visible(value: boolean) {
				if (this._visible === value) return
				this._visible = value
				this.events.emit('change', value)
				if (value) {
					this._log.push('state:visible=true')
				}
			}

			show(): void {
				this.visible = true
			}

			hide(): void {
				this.visible = false
			}
		}


		// 1) Передаём готовые инстансы
		const instanceVisible = new TLoggedVisibilityState(false, log)
		const instanceRendered = new TVisibilityState(true)

		const p1 = new TComponentView({ props: { visible: false }, states: { rendered: instanceRendered, visible: instanceVisible } })
		p1.events.on('change:visible', (value) => {
			log.push(`component-view:change:visible=${value}`)
		})
		p1.visible = true
		expect(log).toContain('state:visible=true')
		expect(log).toContain('component-view:change:visible=true')

		// 2) Передаём конструктор/класс — TComponentView создаст экземпляр сам
		log.length = 0
		const p2 = new TComponentView({ props: { visible: false }, states: { visible: class TLoggedCtor extends TLoggedVisibilityState { constructor(initial = false) { super(initial, log) } } } })
		p2.events.on('change:visible', (value) => {
			log.push(`component-view2:change:visible=${value}`)
		})
		p2.visible = true
		expect(log).toContain('state:visible=true')
		expect(log).toContain('component-view2:change:visible=true')
	})
})
