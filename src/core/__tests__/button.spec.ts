import { describe, it, expect, vi } from 'vitest'
import { TButton } from '../components/button'
import { TLoadingState } from '../base/states'
import type { IButtonProps } from '../components/button'

describe('TButton', () => {
	it('создаётся через { props }, через plain props и с override baseClass', () => {
		const a = new TButton({ props: { text: 'button 1' } })
		expect(a.text).toBe('button 1')
		expect(a.classes).toContain('s-button')

		const b = new TButton({ text: 'button 2' })
		expect(b.text).toBe('button 2')

		const c = new TButton({ props: { text: 'x' }, renderConfig: { baseClass: 's-btn' } })
		expect(c.classes).toContain('s-btn')
	})

	it('classes меняются при смене variant/size/appearance', () => {
		const btn = new TButton({ renderConfig: { baseClass: 's-btn' } })

		btn.variant = 'primary'
		expect(btn.classes).toContain('s-btn--primary')

		btn.size = 'xl'
		expect(btn.classes).toContain('s-btn--size-xl')

		btn.appearance = 'plain'
		expect(btn.classes).toContain('s-btn--plain')
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

	it('loading state: дефолтное поведение (disabled при loading)', () => {
		const btn = new TButton({ loading: false })

		expect(btn.loading).toBe(false)
		expect(btn.disabled).toBe(false)

		btn.loading = true

		expect(btn.loading).toBe(true)
		expect(btn.disabled).toBe(true) // автоматически disabled при loading
	})

	it('loading state: можно переопределить shouldDisable через DI', () => {
		const btn = new TButton({
			states: {
				loading: new TLoadingState({
					shouldDisable: false, // не делаем disabled
				}),
			},
		})

		btn.loading = true

		expect(btn.loading).toBe(true)
		expect(btn.disabled).toBe(false) // не disabled
	})

	it('loading state: можно использовать кастомный LoadingState', () => {
		class CustomLoadingState extends TLoadingState {
			customFlag = false

			override startLoading(): void {
				super.startLoading()
				this.customFlag = true
			}
		}

		const customState = new CustomLoadingState({
			shouldDisable: true,
		})

		const btn = new TButton({
			states: {
				loading: customState,
			},
		})

		btn.loading = true

		expect(btn.loading).toBe(true)
		expect(customState.customFlag).toBe(true)
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

	it('loading + disabled взаимодействие: ручной disabled приоритетнее loading', () => {
		const btn = new TButton()

		// Сценарий 1: disabled = false, loading = true → disabled становится true
		expect(btn.disabled).toBe(false)
		btn.loading = true
		expect(btn.disabled).toBe(true)
		expect(btn.loading).toBe(true)

		// Сценарий 2: loading = true (disabled = true), затем вручную disabled = false
		btn.disabled = false
		expect(btn.disabled).toBe(false) // disabled явно установлен в false
		expect(btn.loading).toBe(true) // loading все еще true

		// Сценарий 3: loading = false, disabled остается false (не возвращается к true)
		btn.loading = false
		expect(btn.disabled).toBe(false) // остается false, так как был установлен вручную
		expect(btn.loading).toBe(false)
	})

	it('loading + disabled взаимодействие: ручной disabled = true не перезаписывается loading', () => {
		const btn = new TButton()

		// Сценарий 1: вручную disabled = true
		btn.disabled = true
		expect(btn.disabled).toBe(true)

		// Сценарий 2: loading = true не должен ничего менять (disabled уже true)
		btn.loading = true
		expect(btn.disabled).toBe(true)
		expect(btn.loading).toBe(true)

		// Сценарий 3: loading = false, disabled остается true (был установлен вручную)
		btn.loading = false
		expect(btn.disabled).toBe(true) // остается true
		expect(btn.loading).toBe(false)
	})

	it('loading + disabled взаимодействие: циклическое переключение', () => {
		const btn = new TButton()

		// loading = true → disabled = true (автоматически)
		btn.loading = true
		expect(btn.disabled).toBe(true)

		// loading = false → disabled = false (автоматически)
		btn.loading = false
		expect(btn.disabled).toBe(false)

		// loading = true снова → disabled = true (автоматически)
		btn.loading = true
		expect(btn.disabled).toBe(true)

		// вручную disabled = false (при активном loading)
		btn.disabled = false
		expect(btn.disabled).toBe(false)

		// loading = false → disabled остается false (был установлен вручную)
		btn.loading = false
		expect(btn.disabled).toBe(false)
	})
})
