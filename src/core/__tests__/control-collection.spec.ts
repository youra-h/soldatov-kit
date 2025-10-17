import { describe, it, expect } from 'vitest'
import { TControl } from '../classes/control'
import { TSpinner } from '../classes/spinner'
import {
	TControlCollection,
	AbstractControlItem,
	AbstractControlValueItem,
	AbstractControlInputItem,
} from './../classes/collection'

// Вспомогательные конкретные реализации для теста
class TestControl extends TControl<any> {}
class TestControlItem extends AbstractControlItem<TestControl> {}
class TestControlValueItem extends AbstractControlValueItem {}
class TestControlInputItem extends AbstractControlInputItem {}

describe('AbstractControlItem', () => {
	it('геттеры/сеттеры делегируют в _control', () => {
		const item = new TestControlItem()
		item.text = 'abc'
		expect(item.text).toBe('abc')
		item.name = 'n'
		expect(item.name).toBe('n')
		item.size = 'lg'
		expect(item.size).toBe('lg')
		item.disabled = true
		expect(item.disabled).toBe(true)
		item.focused = true
		expect(item.focused).toBe(true)
		item.tag = 'span'
		expect(item.tag).toBe('span')
		item.visible = false
		expect(item.visible).toBe(false)
		item.hidden = true
		expect(item.hidden).toBe(true)
	})

	it('assign копирует данные в _control', () => {
		const a = new TestControlItem()
		const b = new TestControlItem()
		a.text = 'x'
		b.assign(a)
		expect(b.text).toBe('x')
	})

	it('free сбрасывает _control', () => {
		const item = new TestControlItem()
		item.free()
		expect(item['_control']).toBeNull()
	})
})

describe('AbstractControlValueItem', () => {
	it('value геттер/сеттер делегирует в _control', () => {
		const item = new TestControlValueItem()
		item.value = 123
		expect(item.value).toBe(123)
	})
})

describe('AbstractControlInputItem', () => {
	it('все геттеры/сеттеры делегируют в _control', () => {
		const item = new TestControlInputItem()
		item.variant = 'primary'
		expect(item.variant).toBe('primary')
		item.readonly = true
		expect(item.readonly).toBe(true)
		item.required = true
		expect(item.required).toBe(true)
		item.invalid = true
		expect(item.invalid).toBe(true)
		item.state = 'error'
		expect(item.state).toBe('error')
		item.loading = true
		expect(item.loading).toBe(true)
		const spinner = TSpinner.create()
		item.spinner = spinner
		expect(item.spinner).toBe(spinner)
	})
})

describe('TControlCollection', () => {
	it('addItem, insertItem, deleteByName, forEachItem, toArray работают', () => {
		const owner = { name: 'owner' }
		const col = new TControlCollection<TestControlItem>(owner, TestControlItem)

		const item1 = col.addItem({
			id: 'item1',
			name: 'control1',
			text: 'Control 1',
		})
		expect(item1).toBeInstanceOf(TestControlItem)
		expect(item1.id).toBe('item1')
		expect(item1.name).toBe('control1')
		expect(item1.text).toBe('Control 1')

		const item3 = col.insertItem(0)
		expect(item3).toBeInstanceOf(TestControlItem)
		item3.name = 'delme'
		expect(col.deleteByName('delme')).toBe(true)

		let count = 0
		col.forEachItem(() => count++)
		expect(count).toBe(col.count)
		expect(col.toArray().length).toBe(col.count)
	})
})
