import { describe, it, expect, vi } from 'vitest'
import { TTabs } from '../components/tabs'
import { TTabItem } from '../components/tabs'
import type { ITabItem } from '../components/tabs'

// ============ TTabItem (через TTabItemCustom) ============

describe('TTabItem', () => {
	it('создаётся с дефолтными значениями', () => {
		const item = new TTabItem()

		expect(item.text).toBe('')
		expect(item.value).toBeUndefined() // value приходит из TValueControl, где default = undefined
		expect(item.closable).toBeUndefined()
		expect(item.active).toBe(false)
	})

	it('позволяет задать text и value', () => {
		const item = new TTabItem()

		item.text = 'Tab 1'
		item.value = 'tab-1'

		expect(item.text).toBe('Tab 1')
		expect(item.value).toBe('tab-1')
	})

	it('closable по умолчанию undefined (наследование от родителя)', () => {
		const item = new TTabItem()

		expect(item.closable).toBeUndefined()

		item.closable = true
		expect(item.closable).toBe(true)

		item.closable = false
		expect(item.closable).toBe(false)

		item.closable = undefined
		expect(item.closable).toBeUndefined()
	})

	it('close() эмитит событие close на events элемента', () => {
		const item = new TTabItem()
		const spy = vi.fn()

		item.events.on('close', spy)

		item.close()

		expect(spy).toHaveBeenCalledOnce()
	})

	it('active переключается и эмитит change', () => {
		const item = new TTabItem()
		const spy = vi.fn()

		item.events.on('change', spy)

		item.active = true
		expect(item.active).toBe(true)
		expect(spy).toHaveBeenCalledOnce()

		spy.mockClear()
		item.active = false
		expect(item.active).toBe(false)
		expect(spy).toHaveBeenCalledOnce()
	})

	it('assign задаёт свойства из объекта', () => {
		const item = new TTabItem()

		item.assign({ text: 'Settings', value: 'settings', closable: true, active: true })

		expect(item.text).toBe('Settings')
		expect(item.value).toBe('settings')
		expect(item.closable).toBe(true)
		expect(item.active).toBe(true)
	})

	it('getProps возвращает все свойства', () => {
		const item = new TTabItem()

		item.text = 'Home'
		item.value = 'home'
		item.closable = false

		const props = item.getProps()

		expect(props.text).toBe('Home')
		expect(props.closable).toBe(false)
		expect(props.active).toBe(false)
	})

	it('не содержит свойство badge', () => {
		const item = new TTabItem()
		const props = item.getProps()

		expect('badge' in props).toBe(false)
		expect((item as any).badge).toBeUndefined()
	})
})

// ============ TTabs ============

describe('TTabs', () => {
	// --- Создание и дефолтные значения ---

	it('создаётся с дефолтными значениями', () => {
		const tabs = new TTabs()

		expect(tabs.orientation).toBe('horizontal')
		expect(tabs.alignment).toBe('start')
		expect(tabs.position).toBe('start')
		expect(tabs.appearance).toBe('line')
		expect(tabs.stretched).toBe(false)
		expect(tabs.closable).toBe(false)
		expect(tabs.count).toBe(0)
		expect(tabs.activeItem).toBeUndefined()
	})

	it('создаётся с переданными props', () => {
		const tabs = new TTabs({
			orientation: 'vertical',
			alignment: 'center',
			position: 'end',
			appearance: 'pills',
			stretched: true,
			closable: true,
		})

		expect(tabs.orientation).toBe('vertical')
		expect(tabs.alignment).toBe('center')
		expect(tabs.position).toBe('end')
		expect(tabs.appearance).toBe('pills')
		expect(tabs.stretched).toBe(true)
		expect(tabs.closable).toBe(true)
	})

	it('создаётся через { props } синтаксис', () => {
		const tabs = new TTabs({
			props: { orientation: 'vertical', closable: true },
		} as any)

		expect(tabs.orientation).toBe('vertical')
		expect(tabs.closable).toBe(true)
	})

	// --- Добавление и управление табами ---

	it('добавляет табы через collection.add', () => {
		const tabs = new TTabs()

		const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)
		const tab2 = tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)

		expect(tabs.count).toBe(2)
		expect(tab1.text).toBe('Tab 1')
		expect(tab1.value).toBe('tab1')
		expect(tab2.text).toBe('Tab 2')
		expect(tab2.value).toBe('tab2')
	})

	it('эмитит tab:added при добавлении таба', () => {
		const tabs = new TTabs()
		const spy = vi.fn()

		tabs.events.on('tab:added', spy)

		const tab = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)

		expect(spy).toHaveBeenCalledOnce()
		expect(spy.mock.calls[0]![0]).toBe(tab)
	})

	// --- Активность ---

	it('активирует таб через collection.setActive', () => {
		const tabs = new TTabs()

		const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)
		const tab2 = tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)

		tabs.collection.setActive(tab1)

		expect(tabs.activeItem).toBe(tab1)
		expect(tab1.active).toBe(true)
		expect(tab2.active).toBe(false)
	})

	it('переключение активного таба деактивирует предыдущий', () => {
		const tabs = new TTabs()

		const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)
		const tab2 = tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)

		tabs.collection.setActive(tab1)
		tabs.collection.setActive(tab2)

		expect(tab1.active).toBe(false)
		expect(tab2.active).toBe(true)
		expect(tabs.activeItem).toBe(tab2)
	})

	it('эмитит tab:activated при смене активного таба', () => {
		const tabs = new TTabs()
		const spy = vi.fn()

		tabs.events.on('tab:activated', spy)

		const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)

		tabs.collection.setActive(tab1)

		expect(spy).toHaveBeenCalled()
		expect(spy.mock.calls[0]![0]).toBe(tab1)
	})

	// --- Closable: логика наследования ---

	describe('closable (наследование от родителя)', () => {
		it('tabs.closable = false (по умолчанию) — все табы не закрываемые', () => {
			const tabs = new TTabs()

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)
			const tab2 = tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)

			expect(tabs.isTabClosable(tab1)).toBe(false)
			expect(tabs.isTabClosable(tab2)).toBe(false)
		})

		it('tabs.closable = true — все табы закрываемые (наследование)', () => {
			const tabs = new TTabs({ closable: true })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)
			const tab2 = tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)

			expect(tabs.isTabClosable(tab1)).toBe(true)
			expect(tabs.isTabClosable(tab2)).toBe(true)
		})

		it('tabs.closable = true, item.closable = false — таб НЕ закрываемый (override)', () => {
			const tabs = new TTabs({ closable: true })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1', closable: false } as any)
			const tab2 = tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)

			expect(tabs.isTabClosable(tab1)).toBe(false)
			expect(tabs.isTabClosable(tab2)).toBe(true)
		})

		it('tabs.closable = false, item.closable = true — таб закрываемый (override)', () => {
			const tabs = new TTabs({ closable: false })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1', closable: true } as any)
			const tab2 = tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)

			expect(tabs.isTabClosable(tab1)).toBe(true)
			expect(tabs.isTabClosable(tab2)).toBe(false)
		})

		it('item.closable = undefined — всегда наследует от родителя', () => {
			const tabs = new TTabs({ closable: true })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)

			expect(tab1.closable).toBeUndefined()
			expect(tabs.isTabClosable(tab1)).toBe(true)

			tabs.closable = false
			expect(tabs.isTabClosable(tab1)).toBe(false)
		})

		it('эмитит change:closable при изменении closable', () => {
			const tabs = new TTabs()
			const spy = vi.fn()

			tabs.events.on('change:closable', spy)

			tabs.closable = true

			expect(spy).toHaveBeenCalledWith(true)
		})
	})

	// --- Закрытие табов ---

	describe('closeTab (удаление таба)', () => {
		it('closeTab удаляет таб из коллекции', () => {
			const tabs = new TTabs({ closable: true })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)
			tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)

			expect(tabs.count).toBe(2)

			const result = tabs.closeTab(tab1)

			expect(result).toBe(true)
			expect(tabs.count).toBe(1)
		})

		it('closeTab возвращает false если таб не закрываемый', () => {
			const tabs = new TTabs({ closable: false })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)

			expect(tabs.count).toBe(1)

			const result = tabs.closeTab(tab1)

			expect(result).toBe(false)
			expect(tabs.count).toBe(1)
		})

		it('closeTab не удаляет таб с closable = false при tabs.closable = true', () => {
			const tabs = new TTabs({ closable: true })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1', closable: false } as any)

			const result = tabs.closeTab(tab1)

			expect(result).toBe(false)
			expect(tabs.count).toBe(1)
		})

		it('closeTab эмитит tab:close перед удалением', () => {
			const tabs = new TTabs({ closable: true })
			const closeSpy = vi.fn()

			tabs.events.on('tab:close', closeSpy)

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)

			tabs.closeTab(tab1)

			expect(closeSpy).toHaveBeenCalledOnce()
			expect(closeSpy.mock.calls[0]![0]).toBe(tab1)
		})

		it('closeTab эмитит tab:removed после удаления', () => {
			const tabs = new TTabs({ closable: true })
			const removeSpy = vi.fn()

			tabs.events.on('tab:removed', removeSpy)

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)

			tabs.closeTab(tab1)

			expect(removeSpy).toHaveBeenCalledOnce()
			expect(removeSpy.mock.calls[0]![0]).toBe(tab1)
		})

		it('item.close() через events тоже вызывает closeTab', () => {
			const tabs = new TTabs({ closable: true })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)
			tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)

			expect(tabs.count).toBe(2)

			// Вызываем close() на самом элементе — должно привести к удалению
			tab1.close()

			expect(tabs.count).toBe(1)
		})

		it('item.close() не удаляет если closable = false', () => {
			const tabs = new TTabs({ closable: false })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)

			tab1.close()

			expect(tabs.count).toBe(1)
		})
	})

	// --- Автопереключение активного таба при закрытии ---

	describe('автопереключение при закрытии активного таба', () => {
		it('при закрытии активного таба — активируется следующий', () => {
			const tabs = new TTabs({ closable: true })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)
			const tab2 = tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)
			const tab3 = tabs.collection.add({ text: 'Tab 3', value: 'tab3' } as any)

			tabs.collection.setActive(tab2)
			expect(tabs.activeItem).toBe(tab2)

			tabs.closeTab(tab2)

			// tab2 был с индексом 1, после удаления tab3 стал с индексом 1
			expect(tabs.activeItem).toBe(tab3)
		})

		it('при закрытии последнего таба — активируется предыдущий', () => {
			const tabs = new TTabs({ closable: true })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)
			const tab2 = tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)
			const tab3 = tabs.collection.add({ text: 'Tab 3', value: 'tab3' } as any)

			tabs.collection.setActive(tab3)
			expect(tabs.activeItem).toBe(tab3)

			tabs.closeTab(tab3)

			expect(tabs.activeItem).toBe(tab2)
		})

		it('при закрытии первого активного таба — активируется следующий (новый первый)', () => {
			const tabs = new TTabs({ closable: true })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)
			const tab2 = tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)

			tabs.collection.setActive(tab1)

			tabs.closeTab(tab1)

			expect(tabs.activeItem).toBe(tab2)
		})

		it('при закрытии единственного таба — activeItem = undefined', () => {
			const tabs = new TTabs({ closable: true })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)

			tabs.collection.setActive(tab1)

			tabs.closeTab(tab1)

			expect(tabs.count).toBe(0)
			expect(tabs.activeItem).toBeUndefined()
		})

		it('при закрытии неактивного таба — activeItem не меняется', () => {
			const tabs = new TTabs({ closable: true })

			const tab1 = tabs.collection.add({ text: 'Tab 1', value: 'tab1' } as any)
			const tab2 = tabs.collection.add({ text: 'Tab 2', value: 'tab2' } as any)
			const tab3 = tabs.collection.add({ text: 'Tab 3', value: 'tab3' } as any)

			tabs.collection.setActive(tab1)

			tabs.closeTab(tab3)

			expect(tabs.activeItem).toBe(tab1)
			expect(tabs.count).toBe(2)
		})
	})

	// --- Свойства отображения ---

	describe('свойства отображения и classes', () => {
		it('classes содержит базовый класс и ориентацию', () => {
			const tabs = new TTabs()

			expect(tabs.classes).toContain('s-tabs')
			expect(tabs.classes).toContain('s-tabs--horizontal')
		})

		it('classes обновляются при смене ориентации', () => {
			const tabs = new TTabs()

			tabs.orientation = 'vertical'

			expect(tabs.classes).toContain('s-tabs--vertical')
			expect(tabs.classes).not.toContain('s-tabs--horizontal')
		})

		it('classes содержит alignment когда != start', () => {
			const tabs = new TTabs({ alignment: 'center' })

			expect(tabs.classes).toContain('s-tabs--center')
		})

		it('classes содержит appearance когда != line', () => {
			const tabs = new TTabs({ appearance: 'pills' })

			expect(tabs.classes).toContain('s-tabs--pills')
		})

		it('classes содержит stretched когда true', () => {
			const tabs = new TTabs({ stretched: true })

			expect(tabs.classes).toContain('s-tabs--stretched')
		})

		it('classes содержит position для vertical когда != start', () => {
			const tabs = new TTabs({ orientation: 'vertical', position: 'end' })

			expect(tabs.classes).toContain('s-tabs--position-end')
		})
	})

	// --- change:* события ---

	describe('события изменения свойств', () => {
		it('эмитит change:orientation', () => {
			const tabs = new TTabs()
			const spy = vi.fn()

			tabs.events.on('change:orientation', spy)
			tabs.orientation = 'vertical'

			expect(spy).toHaveBeenCalledWith('vertical')
		})

		it('эмитит change:alignment', () => {
			const tabs = new TTabs()
			const spy = vi.fn()

			tabs.events.on('change:alignment', spy)
			tabs.alignment = 'center'

			expect(spy).toHaveBeenCalledWith('center')
		})

		it('эмитит change:appearance', () => {
			const tabs = new TTabs()
			const spy = vi.fn()

			tabs.events.on('change:appearance', spy)
			tabs.appearance = 'pills'

			expect(spy).toHaveBeenCalledWith('pills')
		})

		it('эмитит change:stretched', () => {
			const tabs = new TTabs()
			const spy = vi.fn()

			tabs.events.on('change:stretched', spy)
			tabs.stretched = true

			expect(spy).toHaveBeenCalledWith(true)
		})

		it('не эмитит событие если значение не изменилось', () => {
			const tabs = new TTabs()
			const spy = vi.fn()

			tabs.events.on('change:orientation', spy)
			tabs.orientation = 'horizontal' // то же значение

			expect(spy).not.toHaveBeenCalled()
		})
	})

	// --- getProps ---

	it('getProps возвращает все свойства включая closable', () => {
		const tabs = new TTabs({
			orientation: 'vertical',
			alignment: 'center',
			closable: true,
		})

		const props = tabs.getProps()

		expect(props.orientation).toBe('vertical')
		expect(props.alignment).toBe('center')
		expect(props.closable).toBe(true)
	})

	// --- disabled из TControl ---

	it('disabled из TControl работает корректно', () => {
		const tabs = new TTabs()

		expect(tabs.disabled).toBe(false)

		tabs.disabled = true
		expect(tabs.disabled).toBe(true)
	})
})
