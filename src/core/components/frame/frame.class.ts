import { TComponent } from '../../base/component'
import type { IComponentOptions } from '../../base/component'
import { TVisibilityState, type IVisibilityState } from '../../common/states'
import { TStateUnit } from '../../common/state-unit'
import { TEvented } from '../../common/evented'
import type { TValuePayload } from '../../common/types'
import type { IFrame, IFrameProps, TFrameEvents, TFrameStates } from './types'

/**
 * Headless-контейнер для всплывающего контента.
 *
 * Управляет позиционированием (x, y), размером (width, height),
 * видимостью и z-index стеком. Не имеет привязки к DOM — только логика.
 *
 * Каждый показанный Frame получает уникальный возрастающий z-index
 * через статический счётчик {@link TFrame.nextZIndex}.
 *
 * @example
 * const frame = new TFrame({ x: 100, y: 200, width: 300, height: 'auto' })
 * frame.show() // получает z-index, становится visible
 * frame.hide() // скрывается
 */
export default class TFrame
	extends TComponent<IFrameProps, TFrameEvents, TFrameStates>
	implements IFrame
{
	static defaultValues: Partial<IFrameProps> = {
		...TComponent.defaultValues,
		x: 0,
		y: 0,
		width: undefined,
		height: undefined,
		visible: false,
	}

	/** Базовый z-index для всех Frame. Можно переопределить статически. */
	static baseZIndex: number = 1000

	/** Счётчик z-index (только инкремент). */
	private static _zIndexCounter: number = 0

	/**
	 * Получить следующий z-index.
	 * Вызывается автоматически при show(), но доступен и снаружи.
	 */
	static nextZIndex(): number {
		return TFrame.baseZIndex + (++TFrame._zIndexCounter)
	}

	/** Сбросить счётчик (для тестов). */
	static resetZIndexCounter(): void {
		TFrame._zIndexCounter = 0
	}

	private _zIndex: number = 0

	constructor(options: IComponentOptions<IFrameProps, TFrameStates> | Partial<IFrameProps> = {}) {
		const ctor = new.target as typeof TFrame
		const { props = {} as Partial<IFrameProps>, states } =
			ctor.prepareOptions<IFrameProps, TFrameStates>(options)

		super({ props })

		const x = props.x ?? ctor.defaultValues.x!
		const y = props.y ?? ctor.defaultValues.y!
		const width = props.width ?? ctor.defaultValues.width
		const height = props.height ?? ctor.defaultValues.height
		const visible = props.visible ?? ctor.defaultValues.visible!

		this._states.visible = states?.visible ?? new TVisibilityState({ initial: visible })
		this._states.x = states?.x ?? new TStateUnit<number>({ initial: x })
		this._states.y = states?.y ?? new TStateUnit<number>({ initial: y })
		this._states.width = states?.width ?? new TStateUnit<number | string>({ initial: width })
		this._states.height = states?.height ?? new TStateUnit<number | string>({ initial: height })

		this._states.visible.events.on('change', (payload: TValuePayload<boolean>) => {
			;(this.events as TEvented<TFrameEvents>).emit('change:visible', payload.newValue)
		})
		this._states.x.events.on('change', (payload: TValuePayload<number>) => {
			;(this.events as TEvented<TFrameEvents>).emit('change:x', payload.newValue)
		})
		this._states.y.events.on('change', (payload: TValuePayload<number>) => {
			;(this.events as TEvented<TFrameEvents>).emit('change:y', payload.newValue)
		})
		this._states.width.events.on('change', (payload: TValuePayload<number | string>) => {
			;(this.events as TEvented<TFrameEvents>).emit('change:width', payload.newValue)
		})
		this._states.height.events.on('change', (payload: TValuePayload<number | string>) => {
			;(this.events as TEvented<TFrameEvents>).emit('change:height', payload.newValue)
		})
	}

	get visible(): boolean {
		return this._states.visible.value
	}
	set visible(value: boolean) {
		if (value) {
			this.show()
		} else {
			this.hide()
		}
	}

	get x(): number {
		return this._states.x.value
	}
	set x(value: number) {
		this._states.x.value = value
	}

	get y(): number {
		return this._states.y.value
	}
	set y(value: number) {
		this._states.y.value = value
	}

	get width(): number | string {
		return this._states.width.value
	}
	set width(value: number | string) {
		this._states.width.value = value
	}

	get height(): number | string {
		return this._states.height.value
	}
	set height(value: number | string) {
		this._states.height.value = value
	}

	get zIndex(): number {
		return this._zIndex
	}

	show(): void {
		if (this.visible) return

		const canShow = (this.events as TEvented<TFrameEvents>).emitWithResult('beforeShow')
		if (!canShow) return

		this._zIndex = (this.constructor as typeof TFrame).nextZIndex()
		;(this.events as TEvented<TFrameEvents>).emit('change:zIndex', this._zIndex)

		;(this._states.visible as IVisibilityState).show()
		;(this.events as TEvented<TFrameEvents>).emit('show')
	}

	hide(): void {
		if (!this.visible) return

		const canHide = (this.events as TEvented<TFrameEvents>).emitWithResult('beforeHide')
		if (!canHide) return

		;(this._states.visible as IVisibilityState).hide()
		;(this.events as TEvented<TFrameEvents>).emit('hide')
	}

	getProps(): IFrameProps {
		return {
			...super.getProps(),
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			visible: this.visible,
		}
	}
}
