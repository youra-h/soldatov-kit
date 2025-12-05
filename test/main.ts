import { TTree } from '../src/core/classes/tree/tree.class';
import { TTreeItem } from '../src/core/classes/tree/item/tree-item.class';

// 1. Создаем свой класс элемента, если нужно добавить данные (как label, value)
class MyMenuItem extends TTreeItem {
    public label: string = '';
    public value: string = '';

    assign(source: Partial<MyMenuItem>): void {
        if (source.label) this.label = source.label;
        if (source.value) this.value = source.value;

		super.assign(source);
    }
}

// 2. Создаем корневую коллекцию
let rootMenu = new TTree({ itemClass: MyMenuItem });

// 3. Добавляем элементы верхнего уровня
let itemServices = rootMenu.add({ label: 'Услуги', value: 'services' });
let itemAbout = rootMenu.add({ label: 'О нас', value: 'about' });

// 4. Создаем вложенный список для "Услуги"
// Метод createChild автоматически связывает новую коллекцию с itemServices
let servicesSubMenu = itemServices.createChild(MyMenuItem);

// 5. Добавляем элементы во вложенный список
servicesSubMenu.add({ label: 'Разработка', value: 'dev' });
servicesSubMenu.add({ label: 'Дизайн', value: 'design' });

// Проверка структуры
console.log(itemServices.child?.count); // 2
