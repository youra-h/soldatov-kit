import { describe, it, expect, vi } from 'vitest'
import { TLoader } from '../components/loader'
import { TSpinner } from '../components/spinner'
import { TIcon } from '../components/icon'
import { TStateUnit } from '../common/state-unit'

describe('TLoader', () => {
	// --- constructor & defaults ---

	it('создаётся с дефолтными значениями', () => {
		const l = new TLoader()
		expect(l.type).toBe('spinner')
		expect(l.disabled).toBe(true)
		expect(l.indicator).toBe(true)
		expect(l.visible).toBe(true)
		expect(l.ctrl).toBeInstanceOf(TSpinner)
	})

	it('создаётся через { props }', () => {
		const l = new TLoader({
			props: { type: 'icon', disabled: false, indicator: false, visible: false },
		})
		expect(l.type).toBe('icon')
		expect(l.disabled).toBe(false)
		expect(l.indicator).toBe(false)
		expect(l.visible).toBe(false)
		expect(l.ctrl).toBeUndefined()
	})

	it('создаётся через plain props', () => {
		const l = new TLoader({ type: 'skeleton', disabled: false, visible: false })
		expect(l.type).toBe('skeleton')
		expect(l.disabled).toBe(false)
		expect(l.visible).toBe(false)
	})

	// --- type ---

	it('type: изменение эмитит change:type и пересоздаёт ctrl', () => {
		const l = new TLoader({ type: 'spinner' })
		const spy = vi.fn()
		l.events.on('change:type', spy)

		expect(l.ctrl).toBeInstanceOf(TSpinner)

		l.type = 'icon'
		expect(l.type).toBe('icon')
		expect(l.ctrl).toBeInstanceOf(TIcon)
		expect(spy).toHaveBeenCalledWith('icon')

		l.type = 'skeleton'
		expect(l.type).toBe('skeleton')
		expect(l.ctrl).toBeUndefined()
		expect(spy).toHaveBeenCalledWith('skeleton')
	})

	it('type: повторная установка того же значения не эмитит событие', () => {
		const l = new TLoader({ type: 'spinner' })
		const spy = vi.fn()
		l.events.on('change:type', spy)

		l.type = 'spinner'
		expect(spy).not.toHaveBeenCalled()
	})

	// --- size ---

	it('size: делегирует в ctrl (TSpinner)', () => {
		const l = new TLoader({ type: 'spinner' })
		expect(l.size).toBe('normal')

		l.size = 'xl'
		expect(l.size).toBe('xl')
	})

	it('size: делегирует в ctrl (TIcon)', () => {
		const l = new TLoader({ type: 'icon' })
		expect(l.size).toBe('normal')

		l.size = 'xl'
		expect(l.size).toBe('xl')
	})

	it('size: возвращает undefined когда ctrl отсутствует', () => {
		const l = new TLoader({ indicator: false })
		expect(l.ctrl).toBeUndefined()
		expect(l.size).toBeUndefined()
	})

	it('size: установка без ctrl ничего не делает', () => {
		const l = new TLoader({ indicator: false })
		expect(() => { l.size = 'xl' }).not.toThrow()
		expect(l.size).toBeUndefined()
	})

	// --- variant ---

	it('variant: делегирует в ctrl когда это TSpinner', () => {
		const l = new TLoader({ type: 'spinner' })
		expect(l.variant).toBe('accent')

		l.variant = 'caution'
		expect(l.variant).toBe('caution')
	})

	it('variant: возвращает undefined когда ctrl это TIcon', () => {
		const l = new TLoader({ type: 'icon' })
		expect(l.variant).toBeUndefined()
	})

	it('variant: возвращает undefined когда ctrl отсутствует', () => {
		const l = new TLoader({ indicator: false })
		expect(l.variant).toBeUndefined()
	})

	it('variant: установка без ctrl ничего не делает', () => {
		const l = new TLoader({ indicator: false })
		expect(() => { l.variant = 'caution' }).not.toThrow()
	})

	it('variant: установка на TIcon ничего не делает', () => {
		const l = new TLoader({ type: 'icon' })
		l.variant = 'caution'
		expect(l.variant).toBeUndefined()
	})

	// --- disabled ---

	it('disabled: геттер/сеттер и событие change:disabled', () => {
		const l = new TLoader({ disabled: false })
		const spy = vi.fn()
		l.events.on('change:disabled', spy)

		l.disabled = true
		expect(l.disabled).toBe(true)
		expect(spy).toHaveBeenCalledWith(true)
	})

	it('disabled: повторная установка того же значения не эмитит', () => {
		const l = new TLoader({ disabled: true })
		const spy = vi.fn()
		l.events.on('change:disabled', spy)

		l.disabled = true
		expect(spy).not.toHaveBeenCalled()
	})

	// --- indicator ---

	it('indicator: геттер/сеттер и событие change:indicator', () => {
		const l = new TLoader({ indicator: true })
		const spy = vi.fn()
		l.events.on('change:indicator', spy)

		l.indicator = false
		expect(l.indicator).toBe(false)
		expect(spy).toHaveBeenCalledWith(false)
	})

	it('indicator: повторная установка того же значения не эмитит', () => {
		const l = new TLoader({ indicator: true })
		const spy = vi.fn()
		l.events.on('change:indicator', spy)

		l.indicator = true
		expect(spy).not.toHaveBeenCalled()
	})

	it('indicator: выключение очищает ctrl', () => {
		const l = new TLoader({ type: 'spinner', indicator: true })
		expect(l.ctrl).toBeInstanceOf(TSpinner)

		l.indicator = false
		expect(l.ctrl).toBeUndefined()
	})

	it('indicator: включение пересоздаёт ctrl по текущему type', () => {
		const l = new TLoader({ type: 'icon', indicator: false })
		expect(l.ctrl).toBeUndefined()

		l.indicator = true
		expect(l.ctrl).toBeInstanceOf(TIcon)
	})

	// --- visible ---

	it('visible: геттер/сеттер и событие change:visible', () => {
		const l = new TLoader({ visible: true })
		const spy = vi.fn()
		l.events.on('change:visible', spy)

		l.visible = false
		expect(l.visible).toBe(false)
		expect(spy).toHaveBeenCalledWith(false)
	})

	it('visible: повторная установка того же значения не эмитит', () => {
		const l = new TLoader({ visible: false })
		const spy = vi.fn()
		l.events.on('change:visible', spy)

		l.visible = false
		expect(spy).not.toHaveBeenCalled()
	})

	// --- states ---

	it('states.visible: принимает инстанс кастомного state', () => {
		const log: string[] = []

		const customVisible = new TStateUnit({ initial: false })
		customVisible.events.on('change', (payload) => {
			log.push(`custom-visible=${payload.newValue}`)
		})

		const l = new TLoader({
			props: { visible: false },
			states: { visible: customVisible },
		})

		l.visible = true
		expect(l.visible).toBe(true)
		expect(log).toContain('custom-visible=true')
	})

	it('states.visible: принимает state с resolver', () => {
		const customVisible = new TStateUnit({
			initial: false,
			resolver: (value) => {
				// резольвер может валидировать или трансформировать значение
				return value
			},
		})

		const l = new TLoader({
			props: { visible: false },
			states: { visible: customVisible },
		})

		l.visible = true
		expect(l.visible).toBe(true)
	})

	it('states.disabled: принимает инстанс кастомного state', () => {
		const log: string[] = []

		const customDisabled = new TStateUnit({ initial: false })
		customDisabled.events.on('change', (payload) => {
			log.push(`custom-disabled=${payload.newValue}`)
		})

		const l = new TLoader({
			props: { disabled: false },
			states: { disabled: customDisabled },
		})

		l.disabled = true
		expect(l.disabled).toBe(true)
		expect(log).toContain('custom-disabled=true')
	})

	it('states.disabled: принимает state с resolver', () => {
		const customDisabled = new TStateUnit({
			initial: false,
			resolver: (value) => {
				// резольвер может валидировать или трансформировать значение
				return value
			},
		})

		const l = new TLoader({
			props: { disabled: false },
			states: { disabled: customDisabled },
		})

		l.disabled = true
		expect(l.disabled).toBe(true)
	})

	// --- ctrl ---

	it('ctrl: readonly, отражает текущий индикатор', () => {
		const l = new TLoader({ type: 'spinner' })
		expect(l.ctrl).toBeInstanceOf(TSpinner)

		l.type = 'icon'
		expect(l.ctrl).toBeInstanceOf(TIcon)

		l.type = 'skeleton'
		expect(l.ctrl).toBeUndefined()
	})

	// --- created event ---

	it('эмитит created после конструктора', async () => {
		const spy = vi.fn()
		const l = new TLoader()
		l.events.on('created', spy)

		await new Promise((r) => setTimeout(r, 10))
		expect(spy).toHaveBeenCalledWith(l)
	})
})
