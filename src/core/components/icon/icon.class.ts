import { TComponentView } from '../../base/component-view'
import type { IIcon, IIconProps, TIconEvents, TIconStatesOptions } from './types'
import type { TComponentSize } from '../../common/types'
import type { IComponentViewOptions } from '../../base/component-view'
import { resolveState } from '../../common/resolve-state'
import { type IStateUnit, TStateUnit } from '../../common/state-unit'
import type { TValuePayload } from '../../common/types'
import { TEvented } from '../../common/evented'

export default class TIcon
	extends TComponentView<IIconProps, TIconEvents, TIconStatesOptions>
	implements IIcon
{
	static override baseClass = 's-icon'

	static defaultValues: Partial<IIconProps> = {
		...TComponentView.defaultValues,
		size: 'normal',
		tag: 'error',
	}

	protected _width: string | number | undefined
	protected _height: string | number | undefined
	protected _sizeState: IStateUnit<TComponentSize>

	constructor(
		options: IComponentViewOptions<IIconProps, TIconStatesOptions> | Partial<IIconProps> = {},
	) {
		super(options)

		const { props = {} as Partial<IIconProps>, states } = TComponentView.prepareOptions<
			IIconProps,
			TIconStatesOptions
		>(options)

		this._sizeState = resolveState<IStateUnit<TComponentSize>, TComponentSize>({
			state: states?.size,
			ctor: TStateUnit,
			initial: (props.size ?? TIcon.defaultValues.size!) as TComponentSize,
		})

		this._sizeState.events.on('change', (payload: TValuePayload<TComponentSize>) => {
			;(this.events as TEvented<TIconEvents>).emit('change:size' as any, payload)
		})

		this._classes.add(`--size-${this._sizeState.value}`, true)

		this._tag = props.tag ?? TIcon.defaultValues.tag!
		this._width = props.width
		this._height = props.height
	}

	get width(): string | number | undefined {
		return this._width
	}

	set width(value: string | number | undefined) {
		if (this._width !== value) {
			this._width = value
		}
	}

	get height(): string | number | undefined {
		return this._height
	}

	set height(value: string | number | undefined) {
		if (this._height !== value) {
			this._height = value
		}
	}

	get size(): TComponentSize {
		return this._sizeState.value
	}

	protected _applySize(newValue: TComponentSize, oldValue?: TComponentSize) {
		this._classes.swapClass({
			oldClass: `--size-${oldValue}`,
			newClass: `--size-${newValue}`,
		})

		this._sizeState.value = newValue
	}

	set size(value: TComponentSize) {
		if (value === this._sizeState.value) return

		this._applySize(value, this._sizeState.value)
	}

	/**
	 * Получает экземпляр иконки.
	 * @param value Значение, по которому нужно получить иконку, если это уже экземпляр TIcon, он будет возвращен как есть, иначе будет создан новый экземпляр.
	 * @returns Экземпляр иконки.
	 */
	static getInstance(value: TIcon | Object): TIcon {
		if (value instanceof TIcon) {
			return value
		}

		// Если value - объект, создаем новый экземпляр с его свойствами
		if (value && value instanceof Object && 'tag' in value) {
			return new TIcon({ props: value as any })
		}

		// Иначе value - это объект с иконкой
		return new TIcon({ props: { tag: value } })
	}

	getProps(): IIconProps {
		return {
			...super.getProps(),
			size: this._sizeState.value,
			width: this._width,
			height: this._height,
		}
	}
}
