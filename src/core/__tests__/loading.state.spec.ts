import { describe, it, expect, vi } from 'vitest'
import { TLoadingState } from '../base/states'
import { TSpinner } from '../components/spinner'

describe('TLoadingState', () => {
	it('создается с булевым значением', () => {
		const state = new TLoadingState(false)
		expect(state.loading).toBe(false)
		expect(state.spinner).toBeUndefined()
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
		const createSpinner = vi.fn(() => new TSpinner())
		const state = new TLoadingState({
			shouldDisable: true,
			createSpinner,
		})

		expect(state.loading).toBe(false)
		expect(state.behavior.shouldDisable).toBe(true)
		expect(state.behavior.createSpinner).toBe(createSpinner)
	})

	it('startLoading() устанавливает loading = true и эмитит change', () => {
		const state = new TLoadingState(false)
		const handler = vi.fn()

		state.events.on('change', handler)
		state.startLoading()

		expect(state.loading).toBe(true)
		expect(handler).toHaveBeenCalledWith({ loading: true, spinner: undefined })
	})

	it('stopLoading() устанавливает loading = false и эмитит change', () => {
		const state = new TLoadingState(true)
		const handler = vi.fn()

		state.events.on('change', handler)
		state.stopLoading()

		expect(state.loading).toBe(false)
		expect(handler).toHaveBeenCalledWith({ loading: false, spinner: undefined })
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

	it('создает spinner через createSpinner при startLoading', () => {
		const spinner = new TSpinner()
		const createSpinner = vi.fn(() => spinner)

		const state = new TLoadingState({
			createSpinner,
		})

		state.startLoading()

		expect(createSpinner).toHaveBeenCalledTimes(1)
		expect(state.spinner).toBe(spinner)
	})

	it('не создает spinner повторно при повторном startLoading', () => {
		const spinner = new TSpinner()
		const createSpinner = vi.fn(() => spinner)

		const state = new TLoadingState({
			createSpinner,
		})

		state.startLoading()
		state.stopLoading()
		state.startLoading()

		expect(createSpinner).toHaveBeenCalledTimes(1)
		expect(state.spinner).toBe(spinner)
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

	it('не создает spinner если createSpinner не задана', () => {
		const state = new TLoadingState({
			shouldDisable: true,
			// createSpinner не задана
		})

		state.startLoading()

		expect(state.spinner).toBeUndefined()
	})

	it('spinner остается после stopLoading', () => {
		const spinner = new TSpinner()
		const state = new TLoadingState({
			createSpinner: () => spinner,
		})

		state.startLoading()
		expect(state.spinner).toBe(spinner)

		state.stopLoading()
		expect(state.spinner).toBe(spinner) // spinner не удаляется
		expect(state.loading).toBe(false)
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
