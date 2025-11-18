import { describe, it, expect, vi, beforeEach } from 'vitest'
import TSwitch from '../classes/switch/switch.class'
import TIcon from '../classes/icon/icon.class'

describe('TSwitch', () => {
	let sw: TSwitch<any>
	beforeEach(() => {
		sw = TSwitch.create()
	})

	it('устанавливает значения по умолчанию', () => {
		expect(sw.value).toBe(TSwitch.defaultValues.value)
		expect(sw.icon).toBeUndefined()
	})

	it('устанавливает значения через props', () => {
		const icon = new TIcon({ props: { tag: 'icon' } })
		const s = new TSwitch({ props: { value: true, icon } })
		expect(s.value).toBe(true)
		expect(s.icon).toBe(icon)
	})

	it('getProps возвращает все свойства', () => {
		const icon = new TIcon({ props: { tag: 'icon' } })
		const s = new TSwitch({ props: { icon } })
		const props = s.getProps()
		expect(props.icon).toBe(icon)
	})

	it('value сеттер вызывает событие changeValue', () => {
		const handler = vi.fn()
		sw.events.on('changeValue', handler)
		sw.value = true
		expect(handler).toHaveBeenCalledWith(true)
	})

	it('icon сеттер работает и вызывает TIcon.getInstance', () => {
		sw.icon = { tag: 'test' } as any
		expect(sw.icon).toBeInstanceOf(TIcon)
		expect(sw.icon?.tag).toBe('test')
	})

	it('classes содержит baseClass', () => {
		const classes = sw.classes
		expect(classes.some((cls) => cls.includes('s-switch'))).toBe(true)
	})

	it('change переключает состояние и вызывает событие change', () => {
		const handler = vi.fn()
		sw.events.on('change', handler)
		sw.value = false
		sw.change()
		expect(sw.value).toBe(true)
		expect(handler).toHaveBeenCalledWith({ event: undefined, value: true })
		sw.change()
		expect(sw.value).toBe(false)
	})
})
