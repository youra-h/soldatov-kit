import { describe, it, expect, beforeEach } from 'vitest'
import { TFrame } from '../components/frame'

describe('TFrame', () => {
	beforeEach(() => {
		TFrame.resetZIndexCounter()
	})

	it('создаётся со значениями по умолчанию', () => {
		const frame = new TFrame()
		expect(frame.x).toBe(0)
		expect(frame.y).toBe(0)
        expect(frame.width).toBe(100)
        expect(frame.height).toBe(100)
		expect(frame.visible).toBe(false)
		expect(frame.zIndex).toBe(0)
	})

	it('создаётся с переданными props', () => {
		const frame = new TFrame({ x: 100, y: 200, width: 300, height: 400, visible: true })
		expect(frame.x).toBe(100)
		expect(frame.y).toBe(200)
		expect(frame.width).toBe(300)
		expect(frame.height).toBe(400)
		expect(frame.visible).toBe(true)
	})

	it('создаётся через { props } и через plain props', () => {
		const a = new TFrame({ props: { x: 10, y: 20 } })
		expect(a.x).toBe(10)
		expect(a.y).toBe(20)

		const b = new TFrame({ x: 30, y: 40 })
		expect(b.x).toBe(30)
		expect(b.y).toBe(40)
	})

	it('show() делает visible = true и присваивает z-index', () => {
		const frame = new TFrame()
		expect(frame.visible).toBe(false)
		expect(frame.zIndex).toBe(0)

		frame.show()
		expect(frame.visible).toBe(true)
		expect(frame.zIndex).toBeGreaterThan(0)
	})

	it('hide() делает visible = false', () => {
		const frame = new TFrame({ visible: true })
		expect(frame.visible).toBe(true)

		frame.hide()
		expect(frame.visible).toBe(false)
	})

	it('show() при уже visible не меняет z-index', () => {
		const frame = new TFrame({ visible: true })
		frame.show()
		const firstZ = frame.zIndex

		frame.show()
		expect(frame.zIndex).toBe(firstZ)
	})

	it('hide() при уже hidden не эмитит событий', () => {
		const frame = new TFrame()
		const events: string[] = []
		frame.events.on('hide' as any, () => events.push('hide'))
		frame.events.on('beforeHide' as any, () => {
			events.push('beforeHide')
			return true
		})

		frame.hide()
		expect(events).toEqual([])
	})

	it('z-index увеличивается с каждым новым show()', () => {
		const frame1 = new TFrame()
		const frame2 = new TFrame()

		frame1.show()
		const z1 = frame1.zIndex

		frame2.show()
		const z2 = frame2.zIndex

		expect(z2).toBeGreaterThan(z1)
	})

	it('z-index продолжает расти после hide/show (только инкремент)', () => {
		const frame = new TFrame()
		frame.show()
		const z1 = frame.zIndex

		frame.hide()
		frame.show()
		const z2 = frame.zIndex

		expect(z2).toBeGreaterThan(z1)
	})

	it('beforeShow может отменить показ', () => {
		const frame = new TFrame()
		frame.events.on('beforeShow' as any, () => false)

		frame.show()
		expect(frame.visible).toBe(false)
		expect(frame.zIndex).toBe(0)
	})

	it('beforeHide может отменить скрытие', () => {
		const frame = new TFrame({ visible: true })
		frame.events.on('beforeHide' as any, () => false)

		frame.hide()
		expect(frame.visible).toBe(true)
	})

	it('show/hide эмитят события', () => {
		const frame = new TFrame()
		const log: string[] = []

		frame.events.on('beforeShow' as any, () => {
			log.push('beforeShow')
			return true
		})
		frame.events.on('show' as any, () => log.push('show'))
		frame.events.on('beforeHide' as any, () => {
			log.push('beforeHide')
			return true
		})
		frame.events.on('hide' as any, () => log.push('hide'))

		frame.show()
		expect(log).toEqual(['beforeShow', 'show'])

		frame.hide()
		expect(log).toEqual(['beforeShow', 'show', 'beforeHide', 'hide'])
	})

	it('change:visible эмитится при show/hide', () => {
		const frame = new TFrame()
		const values: boolean[] = []
		frame.events.on('change:visible' as any, (v: boolean) => values.push(v))

		frame.show()
		frame.hide()

		expect(values).toEqual([true, false])
	})

	it('change:x / change:y эмитятся при изменении координат', () => {
		const frame = new TFrame()
		const xValues: number[] = []
		const yValues: number[] = []
		frame.events.on('change:x' as any, (v: number) => xValues.push(v))
		frame.events.on('change:y' as any, (v: number) => yValues.push(v))

		frame.x = 100
		frame.y = 200

		expect(xValues).toEqual([100])
		expect(yValues).toEqual([200])
	})

	it('change:width / change:height эмитятся при изменении размеров', () => {
		const frame = new TFrame()
		const widthValues: (number | string)[] = []
		const heightValues: (number | string)[] = []
		frame.events.on('change:width' as any, (v: number | string) => widthValues.push(v))
		frame.events.on('change:height' as any, (v: number | string) => heightValues.push(v))

		frame.width = 500
		frame.height = 'auto'

		expect(widthValues).toEqual([500])
		expect(heightValues).toEqual(['auto'])
	})

	it('change:zIndex эмитится при show()', () => {
		const frame = new TFrame()
		const zValues: number[] = []
		frame.events.on('change:zIndex' as any, (v: number) => zValues.push(v))

		frame.show()
		expect(zValues.length).toBe(1)
		expect(zValues[0]).toBeGreaterThan(0)
	})

	it('setter visible вызывает show/hide', () => {
		const frame = new TFrame()
		const log: string[] = []
		frame.events.on('show' as any, () => log.push('show'))
		frame.events.on('hide' as any, () => log.push('hide'))

		frame.visible = true
		expect(log).toContain('show')
		expect(frame.visible).toBe(true)

		frame.visible = false
		expect(log).toContain('hide')
		expect(frame.visible).toBe(false)
	})

	it('getProps/toJSON отражают все свойства', () => {
		const frame = new TFrame({
			x: 10,
			y: 20,
			width: 300,
			height: 200,
			visible: true,
            position: 'absolute',
            target: '#portal',
        })

		const props = frame.getProps()
		expect(props).toMatchObject({
			x: 10,
			y: 20,
			width: 300,
			height: 200,
			visible: true,
            position: 'absolute',
            target: '#portal',
		})
		expect(frame.toJSON()).toEqual(props)
	})

	it('nextZIndex и resetZIndexCounter работают', () => {
		TFrame.resetZIndexCounter()

		const z1 = TFrame.nextZIndex() // 1000 + 1 = 1001
		const z2 = TFrame.nextZIndex() // 1000 + 2 = 1002
		expect(z2).toBeGreaterThan(z1)

		TFrame.resetZIndexCounter()
		const z3 = TFrame.nextZIndex() // 1000 + 1 = 1001
		expect(z3).toBe(z1)
	})

	it('baseZIndex можно переопределить статически', () => {
		const OriginalBase = TFrame.baseZIndex
		TFrame.baseZIndex = 5000
		TFrame.resetZIndexCounter()

		const frame = new TFrame()
		frame.show()

		expect(frame.zIndex).toBe(5001)

		TFrame.baseZIndex = OriginalBase
		TFrame.resetZIndexCounter()
	})

	it('width/height принимают строки', () => {
		const frame = new TFrame({ width: '100%', height: 'auto' })
		expect(frame.width).toBe('100%')
		expect(frame.height).toBe('auto')
	})

	it('static create работает', () => {
		const frame = TFrame.create({ x: 50, y: 50 })
		expect(frame).toBeInstanceOf(TFrame)
		expect(frame.x).toBe(50)
		expect(frame.y).toBe(50)
	})

    it('position по умолчанию fixed', () => {
        const frame = new TFrame()
        expect(frame.position).toBe('fixed')
    })

    it('position можно задать при создании', () => {
        const frame = new TFrame({ position: 'absolute' })
        expect(frame.position).toBe('absolute')
    })

    it('position можно изменить через сеттер', () => {
        const frame = new TFrame()
        frame.position = 'absolute'
        expect(frame.position).toBe('absolute')
    })

    it('change:position эмитится при изменении', () => {
        const frame = new TFrame()
        const values: string[] = []
        frame.events.on('change:position' as any, (v: string) => values.push(v))

        frame.position = 'absolute'
        expect(values).toEqual(['absolute'])
    })

    it('target по умолчанию body', () => {
        const frame = new TFrame()
        expect(frame.target).toBe('body')
    })

    it('target можно задать при создании', () => {
        const frame = new TFrame({ target: '#portal' })
        expect(frame.target).toBe('#portal')
    })

    it('target можно изменить через сеттер', () => {
        const frame = new TFrame()
        frame.target = '#my-modal'
        expect(frame.target).toBe('#my-modal')
    })

    it('change:target эмитится при изменении', () => {
        const frame = new TFrame()
        const values: string[] = []
        frame.events.on('change:target' as any, (v: string) => values.push(v))

        frame.target = '#portal'
        expect(values).toEqual(['#portal'])
    })
})
