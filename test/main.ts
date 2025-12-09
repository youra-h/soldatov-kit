import { TActivatableCollection } from '../src/core/classes/collection/activable/activable-collection.class';
import { TActivatableCollectionItem } from '../src/core/classes/collection/activable/activable-collection-item.class';
import { asTreeCollection } from '../src/core/classes/tree/tree.class';
import { asTreeItem } from '../src/core/classes/tree/item/mixins';

// --- 1. Определяем классы для Меню (как мы обсуждали) ---

// Базовый класс коллекции с функционалом дерева и активности
const TreeActivatableCollection = asTreeCollection(TActivatableCollection);

// Класс элемента меню
class TMenuItem extends asTreeItem(TActivatableCollectionItem) {
    public label: string = '';

    assign(source: Partial<TMenuItem>): void {
        if (source.label) this.label = source.label;
        // Важно: передаем active в super.assign или устанавливаем вручную, если он есть в source
        // TActivatableCollectionItem не имеет assign для active по умолчанию в базовой реализации TObject?
        // Если нет, то лучше явно:
        if (source.active !== undefined) this.active = source.active;

        super.assign(source);
    }
}

// Класс коллекции меню с логикой "Глобального Активного Элемента"
class TMenuCollection extends TreeActivatableCollection {
    // Хранилище глобально активного элемента (только для корневой коллекции)
    private _globalActiveItem: TMenuItem | null = null;

    constructor(options: any) {
        super(options);
    }

    /**
     * Перехватываем локальную активацию
     */
    setActive(item: TMenuItem): void {
        super.setActive(item); // Локальная логика (в пределах одного списка)
        this._bubbleActiveItem(item); // Всплытие
    }

    /**
     * Всплытие события активации к корню
     */
    protected _bubbleActiveItem(item: TMenuItem): void {
        if (this.parentItem) {
            // Если есть родитель, передаем ему
            const parentCollection = this.parentItem.collection as TMenuCollection;
            if (parentCollection) {
                parentCollection._onChildActive(item);
            }
        } else {
            // Если родителя нет, значит мы - Корень
            this._handleRootGlobalActive(item);
        }
    }

    /**
     * Обработка сигнала от дочерних элементов
     */
    public _onChildActive(activeItemInDeep: TMenuItem): void {
        if (this.parentItem) {
            const parentCollection = this.parentItem.collection as TMenuCollection;
            parentCollection?._onChildActive(activeItemInDeep);
        } else {
            this._handleRootGlobalActive(activeItemInDeep);
        }
    }

    /**
     * Логика корня: выключаем предыдущий активный элемент
     */
    private _handleRootGlobalActive(newItem: TMenuItem): void {
        // Если был другой активный элемент и это не тот же самый
        if (this._globalActiveItem && this._globalActiveItem !== newItem) {
            console.log(`[Root] Deactivating previous: ${this._globalActiveItem.label}`);
            this._globalActiveItem.active = false;
        }

        this._globalActiveItem = newItem;
        console.log(`[Root] New global active: ${newItem.label}`);
    }

    // Вспомогательный метод для теста
    public getGlobalActiveLabel(): string | undefined {
        return this._globalActiveItem?.label;
    }
}


// --- 2. Сценарий Тестирования ---

console.log('--- START MENU TEST ---');

// 1. Создаем корневое меню
const rootMenu = new TMenuCollection({ itemClass: TMenuItem });

// 2. Строим структуру
// Root
//  |- Файл
//  |   |- Создать
//  |   |- Открыть
//  |- Правка
//  |- Вид
//      |- Инструменты
//          |- Опция 1
//          |- Опция 2

const itemFile = rootMenu.add({ label: 'Файл' });
const itemEdit = rootMenu.add({ label: 'Правка' });
const itemView = rootMenu.add({ label: 'Вид' });

// Подменю Файл
const fileSubMenu = itemFile.createChild(TMenuCollection, TMenuItem);
const itemCreate = fileSubMenu.add({ label: 'Создать' });
const itemOpen = fileSubMenu.add({ label: 'Открыть' });

// Подменю Вид
const viewSubMenu = itemView.createChild(TMenuCollection, TMenuItem);
const itemTools = viewSubMenu.add({ label: 'Инструменты' });

// Подменю Инструменты (3-й уровень)
const toolsSubMenu = itemTools.createChild(TMenuCollection, TMenuItem);
const itemOpt1 = toolsSubMenu.add({ label: 'Опция 1' });
const itemOpt2 = toolsSubMenu.add({ label: 'Опция 2' });


// --- ТЕСТЫ ---

function checkState(expectedActiveLabel: string | null) {
    const actual = rootMenu.getGlobalActiveLabel();
    const status = actual === expectedActiveLabel ? 'PASS' : `FAIL (Expected: ${expectedActiveLabel}, Got: ${actual})`;
    console.log(`Check State: ${status}`);

    // Дополнительная проверка: убедимся, что старые элементы реально выключены
    if (expectedActiveLabel !== 'Файл' && itemFile.active) console.error('ERROR: File is still active!');
    if (expectedActiveLabel !== 'Создать' && itemCreate.active) console.error('ERROR: Create is still active!');
    if (expectedActiveLabel !== 'Опция 1' && itemOpt1.active) console.error('ERROR: Option 1 is still active!');
}

console.log('\n1. Активируем элемент корневого уровня ("Файл")');
itemFile.active = true;
// Ожидаем: Файл активен
checkState('Файл');

console.log('\n2. Активируем элемент во вложенном меню ("Создать")');
// Это должно деактивировать "Файл" (так как он был глобально активным)
itemCreate.active = true;
checkState('Создать');

console.log('\n3. Активируем соседний элемент в том же подменю ("Открыть")');
// "Создать" должен погаснуть (логика TActivatableCollection), "Открыть" загореться
itemOpen.active = true;
checkState('Открыть');
console.log(`Is Create active? ${itemCreate.active}`); // false

console.log('\n4. Активируем элемент в глубоком уровне другой ветки ("Опция 1")');
// "Открыть" должен погаснуть.
itemOpt1.active = true;
checkState('Опция 1');
console.log(`Is Open active? ${itemOpen.active}`); // false

console.log('\n5. Активируем элемент в корне ("Правка")');
// "Опция 1" должна погаснуть.
itemEdit.active = true;
checkState('Правка');
console.log(`Is Option 1 active? ${itemOpt1.active}`); // false

console.log('\n--- END MENU TEST ---');
