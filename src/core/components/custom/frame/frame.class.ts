import { TComponent } from '../../base/component'
import type { IComponentOptions } from '../../base/component'
import { TStateUnit, TEvented } from '../../../common'
import type { TValuePayload } from '../../../bridge'
import type { IFrame, IFrameProps, TFrameEvents, TFrameStates, TFramePosition } from './types'

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
	implements IFrame {
	static defaultValues: Partial<IFrameProps> = {
		...TComponent.defaultValues,
		x: 0,
		y: 0,
		width: 100,
		height: 100,
		visible: false,
		position: 'fixed',
		target: 'body',
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
	private _position: TFramePosition
	private _target: string

	constructor(options: IComponentOptions<IFrameProps, TFrameStates> | Partial<IFrameProps> = {}) {
		const ctor = new.target as typeof TFrame
		const { props = {} as Partial<IFrameProps> } =
			ctor.prepareOptions<IFrameProps, TFrameStates>(options)

		super(options)

		const x = props.x ?? ctor.defaultValues.x!
		const y = props.y ?? ctor.defaultValues.y!
		const width = props.width ?? ctor.defaultValues.width!
		const height = props.height ?? ctor.defaultValues.height!

		this._position = props.position ?? ctor.defaultValues.position!
		this._target = props.target ?? ctor.defaultValues.target!

		this._states.x = new TStateUnit<number>({ initial: x }) as TFrameStates['x']
		this._states.y = new TStateUnit<number>({ initial: y }) as TFrameStates['y']
		this._states.width = new TStateUnit<number | string>({ initial: width }) as TFrameStates['width']
		this._states.height = new TStateUnit<number | string>({ initial: height }) as TFrameStates['height']

		this._states.x.events.on('change', (payload: TValuePayload<number>) => {
			; (this.events as TEvented<TFrameEvents>).emit('change:x', payload.newValue)
		})
		this._states.y.events.on('change', (payload: TValuePayload<number>) => {
			; (this.events as TEvented<TFrameEvents>).emit('change:y', payload.newValue)
		})
		this._states.width.events.on('change', (payload: TValuePayload<number | string>) => {
			; (this.events as TEvented<TFrameEvents>).emit('change:width', payload.newValue)
		})
		this._states.height.events.on('change', (payload: TValuePayload<number | string>) => {
			; (this.events as TEvented<TFrameEvents>).emit('change:height', payload.newValue)
		})

			// При show() — присваиваем z-index
			; (this.events as TEvented<TFrameEvents>).on('show' as any, () => {
				this._zIndex = (this.constructor as typeof TFrame).nextZIndex()

					; (this.events as TEvented<TFrameEvents>).emit('change:zIndex', this._zIndex)
			})
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

	get position(): TFramePosition {
		return this._position
	}
	set position(value: TFramePosition) {
		if (this._position === value) return
		this._position = value
			; (this.events as TEvented<TFrameEvents>).emit('change:position', value)
	}

	get target(): string {
		return this._target
	}
	set target(value: string) {
		if (this._target === value) return
		this._target = value
			; (this.events as TEvented<TFrameEvents>).emit('change:target', value)
	}

	get zIndex(): number {
		return this._zIndex
	}

	getProps(): IFrameProps {
		return {
			...super.getProps(),
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			position: this.position,
			target: this.target,
		}
	}
}
