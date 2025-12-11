import { TActivatableTree } from '../src/core/classes/tree/activable/activable-tree.class'
import { TActivatableTreeItem } from '../src/core/classes/tree/activable/activable-tree-item.class'
import type { TConstructor } from '../src/core/common/types'

export class TMenuItem extends TActivatableTreeItem {
	public label: string = ''
	public icon: string = ''
	public id: string = ''
	// Можно добавить href, disabled и т.д.

	assign(source: Partial<TMenuItem>): void {
		if (source.label) this.label = source.label
		if (source.icon) this.icon = source.icon
		if (source.id) this.id = source.id

		// Важно: вызываем super.assign, чтобы обработать active и другие базовые свойства
		super.assign(source)
	}
}

/**
 * Класс Меню.
 * Наследуется от TActivatableTree, но уже настроен на работу с TMenuItem.
 */
export class TMenu extends TActivatableTree<TMenuItem> {
	constructor(options?: { itemClass?: TConstructor<TMenuItem> }) {
		super({
			// По умолчанию используем TMenuItem, но даем возможность переопределить
			itemClass: options?.itemClass ?? TMenuItem,
		})
	}

	// Здесь можно добавить специфичные методы для меню.
	// Например, поиск по ID или Label.

	/**
	 * Найти пункт меню по ID.
	 */
	findById(id: string): TMenuItem | undefined {
		return this.find((item) => item.id === id)
	}
}

// --- Simple sequential demo for browser console ---
function _assert(name: string, cond: boolean) {
    if (cond) console.log(`%cPASS: ${name}`, 'color:green')
    else console.error(`%cFAIL: ${name}`, 'color:red')
}

// Build menu
console.log('--- Building demo menu ---')
const menu = new TMenu()
console.log('menu instanceof TMenu ->', menu instanceof TMenu)

// Create structure
const root = menu.add({ label: 'Root', id: 'root' })
const sub = root.createChild(TMenuItem)
const childA = sub.add({ label: 'Child A', id: 'child-a' })
const childB = sub.add({ label: 'Child B', id: 'child-b' })
const subSub = childB.createChild(TMenuItem)
const grand = subSub.add({ label: 'Grand', id: 'grand-1' })

console.log('Structure created:')
console.log('root.label=', root.label)
console.log('childA.label=', childA.label)
console.log('grand.label=', grand.label)

// Search test
const found = menu.findById('grand-1')
console.log('Search for id=grand-1 ->', found ? found.label : null)
_assert('findById returns correct node', !!found && found.label === 'Grand')

// Activation tests
console.log('\n--- Activation tests ---')
const r1 = menu.add({ label: 'R1', id: 'r1' })
const r2 = menu.add({ label: 'R2', id: 'r2' })
const s1 = r1.createChild(TMenuItem)
const c11 = s1.add({ label: 'C1.1', id: 'c1.1' })
const c12 = s1.add({ label: 'C1.2', id: 'c1.2' })
const s12 = c12.createChild(TMenuItem)
const g = s12.add({ label: 'G1', id: 'g1' })

// Activate r1
r1.active = true
console.log('Activated r1 -> menu.activeItem id =', (menu as any).activeItem?.id)
_assert('r1 becomes active', (menu as any).activeItem === r1 && r1.active === true)

// Activate c11
c11.active = true
console.log('Activated c11 -> menu.activeItem id =', (menu as any).activeItem?.id)
 _assert('c11 becomes active and r1 deactivated', (menu as any).activeItem === c11 && !r1.active)

// Activate grandchild
g.active = true
console.log('Activated g -> menu.activeItem id =', (menu as any).activeItem?.id)
 _assert('grand becomes active and c11 deactivated', (menu as any).activeItem === g && !c11.active)

// Activate r2
r2.active = true
console.log('Activated r2 -> menu.activeItem id =', (menu as any).activeItem?.id)
 _assert('r2 becomes active and grand deactivated', (menu as any).activeItem === r2 && !g.active)

console.log('\nDemo finished')
