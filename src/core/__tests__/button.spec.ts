import { describe, it, expect, vi } from 'vitest'
import { TButton } from '../components/button'
import { TIcon } from '../components/icon'
import { TSpinner } from '../components/spinner'
import { TLoadingState } from '../base/states'
import type { IButtonProps } from '../components/button'

describe('TButton', () => {
	it('создаётся через { props }, через plain props и с override baseClass', () => {
		const a = new TButton({ props: { text: 'button 1' } })
		expect(a.text).toBe('button 1')
		expect(a.classes).toContain('s-button')

		const b = new TButton({ text: 'button 2' })
		expect(b.text).toBe('button 2')

		const c = new TButton({ props: { text: 'x' }, baseClass: 's-btn' })
		expect(c.classes).toContain('s-btn')
	})

	it('classes меняются при смене variant/size/appearance', () => {
		const btn = new TButton({ baseClass: 's-btn' })

		btn.variant = 'primary'
		expect(btn.classes).toContain('s-btn--primary')

		btn.size = 'xl'
		expect(btn.classes).toContain('s-btn--size-xl')

		btn.appearance = 'plain'
		expect(btn.classes).toContain('s-btn--plain')
	})

	it('icon: принимает инстанс и создаёт через getInstance из объекта/тэга; синхронизирует size', () => {
		const btn = new TButton({ size: 'normal' })

		const icon1 = new TIcon({ tag: 'i1', size: 'lg' })
		btn.icon = icon1
		expect(btn.icon).toBe(icon1)
		// сеттер кнопки должен привести размер иконки к размеру кнопки
		expect(btn.icon!.size).toBe('normal')

		btn.icon = TIcon.getInstance({ tag: 'i2', size: 'xl' })
		expect(btn.icon).toBeInstanceOf(TIcon)
		expect(btn.icon!.size).toBe('normal')

		// размер кнопки меняется -> иконка синхронизируется через обработчик change:size
		btn.size = 'xl'
		expect(btn.icon!.size).toBe('xl')
	})

	it('spinner: создаётся лениво через TLoadingState и синхронизирует size/variant от кнопки', () => {
		const btn = new TButton({ size: 'normal', variant: 'normal' })

		// Spinner создается лениво при первом обращении к loading state
		expect(btn.loadingState.spinner).toBeUndefined()

		btn.loading = true
		const sp = btn.loadingState.spinner
		expect(sp).toBeInstanceOf(TSpinner)
		expect(sp!.variant).toBe('normal')
		expect(sp!.size).toBe('normal')

		btn.variant = 'primary'
		expect(sp!.variant).toBe('primary')

		btn.size = 'xl'
		expect(sp!.size).toBe('xl')
	})

	it('getProps/toJSON отражают ключевые props', () => {
		const btn = new TButton({
			props: {
				text: 't',
				variant: 'secondary',
				size: 'lg',
				appearance: 'outlined',
				loading: true,
			},
			baseClass: 's-btn',
		} as any)

		const props = btn.getProps()
		expect(props).toMatchObject({
			text: 't',
			variant: 'secondary',
			size: 'lg',
			appearance: 'outlined',
			loading: true,
		})
		expect(btn.toJSON()).toEqual(props)
	})

	it('loading state: дефолтное поведение (disabled + spinner)', () => {
		const btn = new TButton({ loading: false })

		expect(btn.loading).toBe(false)
		expect(btn.disabled).toBe(false)
		expect(btn.loadingState.spinner).toBeUndefined()

		btn.loading = true

		expect(btn.loading).toBe(true)
		expect(btn.disabled).toBe(true) // автоматически disabled при loading
		expect(btn.loadingState.spinner).toBeInstanceOf(TSpinner)
	})

	it('loading state: можно переопределить behavior через DI', () => {
		const btn = new TButton({
			states: {
				loading: new TLoadingState({
					shouldDisable: false, // не делаем disabled
					createSpinner: undefined, // не создаем spinner
				}),
			},
		})

		btn.loading = true

		expect(btn.loading).toBe(true)
		expect(btn.disabled).toBe(false) // не disabled
		expect(btn.loadingState.spinner).toBeUndefined() // нет spinner
	})

	it('loading state: можно использовать кастомный LoadingState', () => {
		class CustomLoadingState extends TLoadingState<TSpinner> {
			customFlag = false

			override startLoading(): void {
				super.startLoading()
				this.customFlag = true
			}
		}

		const customState = new CustomLoadingState({
			shouldDisable: true,
			createSpinner: () => new TSpinner({ props: { size: 'lg' } }),
		})

		const btn = new TButton({
			states: {
				loading: customState,
			},
		})

		btn.loading = true

		expect(btn.loading).toBe(true)
		expect(customState.customFlag).toBe(true)
		expect(btn.loadingState.spinner!.size).toBe('lg')
	})

	it('loading state: эмитит change:loading при изменении', () => {
		const btn = new TButton()
		const handler = vi.fn()

		btn.events.on('change:loading', handler)

		btn.loading = true
		expect(handler).toHaveBeenCalledWith(true)

		btn.loading = false
		expect(handler).toHaveBeenCalledWith(false)
	})
})
