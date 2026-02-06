import { describe, it, expect, vi } from 'vitest'
import { TLoadingState } from '../base/states'

describe('TLoadingState', () => {
	it('создается с булевым значением', () => {
		const state = new TLoadingState(false)
		expect(state.loading).toBe(false)
		expect(state.behavior.shouldDisable).toBeUndefined()
	})

	it('создается с дефолтным значением false', () => {
		const state = new TLoadingState()
		expect(state.loading).toBe(false)
	})

	it('создается с начальным значением true', () => {
		const state = new TLoadingState(true)
		expect(state.loading).toBe(true)
	})

	it('создается с behavior объектом', () => {
		const state = new TLoadingState({
			shouldDisable: true,
		})

		expect(state.loading).toBe(false)
		expect(state.behavior.shouldDisable).toBe(true)
	})

	it('startLoading() устанавливает loading = true и эмитит change', () => {
		const state = new TLoadingState(false)
		const handler = vi.fn()

		state.events.on('change', handler)
		state.startLoading()

		expect(state.loading).toBe(true)
		expect(handler).toHaveBeenCalledWith({ loading: true })
	})

	it('stopLoading() устанавливает loading = false и эмитит change', () => {
		const state = new TLoadingState(true)
		const handler = vi.fn()

		state.events.on('change', handler)
		state.stopLoading()

		expect(state.loading).toBe(false)
		expect(handler).toHaveBeenCalledWith({ loading: false })
	})

	it('повторный вызов startLoading() не эмитит change', () => {
		const state = new TLoadingState(false)
		const handler = vi.fn()

		state.events.on('change', handler)
		state.startLoading()
		state.startLoading()

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('повторный вызов stopLoading() не эмитит change', () => {
		const state = new TLoadingState(true)
		const handler = vi.fn()

		state.events.on('change', handler)
		state.stopLoading()
		state.stopLoading()

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('сеттер loading вызывает startLoading/stopLoading', () => {
		const state = new TLoadingState(false)
		const handler = vi.fn()

		state.events.on('change', handler)

		state.loading = true
		expect(state.loading).toBe(true)
		expect(handler).toHaveBeenCalledTimes(1)

		state.loading = false
		expect(state.loading).toBe(false)
		expect(handler).toHaveBeenCalledTimes(2)
	})

	it('поддерживает кастомное наследование', () => {
		class CustomLoadingState extends TLoadingState {
			customProperty = 'test'

			override startLoading(): void {
				super.startLoading()
				this.customProperty = 'loading'
			}
		}

		const state = new CustomLoadingState(false)
		expect(state.customProperty).toBe('test')

		state.startLoading()
		expect(state.loading).toBe(true)
		expect(state.customProperty).toBe('loading')
	})
})
