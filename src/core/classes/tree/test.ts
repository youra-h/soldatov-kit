/**
 * 1. Интерфейс для базовых данных элемента дерева (Item Data)
 * Определяет структуру данных, которую будет хранить каждый узел.
 */
interface IItemData {
    // Произвольное уникальное значение/идентификатор
    value: string | number;
    // Флаг, указывающий, активен ли элемент в данный момент
    activate: boolean;
    // Любые другие полезные свойства, например, название пункта меню
    label: string;
}

/**
 * 2. Интерфейс для представления узла дерева (Tree Node)
 * Каждый узел может иметь дочерние элементы того же типа.
 */
interface ITreeNode {
    // Основные данные элемента
    data: IItemData;
    // Ссылка на родительский элемент (опционально, полезно для навигации вверх)
    parent: ITreeNode | null;
    // Массив дочерних узлов
    children: ITreeNode[];
}

/**
 * 3. Класс TreeItem - Реализация конкретного элемента/узла дерева
 * Инкапсулирует логику работы с одним узлом.
 */
class TreeItem implements ITreeNode {
    public data: IItemData;
    public parent: ITreeNode | null = null;
    public children: ITreeNode[] = [];

    constructor(data: IItemData, parent: ITreeNode | null = null) {
        this.data = data;
        this.parent = parent;
    }

    // Метод для добавления дочернего элемента
    addChild(child: TreeItem): void {
        child.parent = this;
        this.children.push(child);
    }
}

/**
 * 4. Класс TreeCollection - Управляет всей древовидной структурой и состоянием активности
 * Отвечает за инициализацию структуры и управление активным элементом.
 */
class TreeCollection {
    private roots: TreeItem[] = [];
    private activeItem: TreeItem | null = null;

    // ... (конструктор и addRoot остаются прежними) ...
    constructor(initialStructure: IItemData[]) {}

    addRoot(item: TreeItem): void {
        this.roots.push(item);
        if (item.data.activate) {
            this.setActiveItem(item);
        }
    }

	/**
     * Возвращает текущий активный элемент.
     */
    public getActiveItem(): TreeItem | null {
        return this.activeItem;
    }

    /**
     * Устанавливает новый активный элемент.
     * Реализует логику: если новый элемент отличается от текущего,
     * снимает активность с предыдущего и устанавливает новому.
     * @param item Новый активный элемент.
     */
    public setActiveItem(item: TreeItem): void {
        if (this.activeItem === item) {
            return; // Элемент уже активен, ничего не делаем
        }

        // 1. Снимаем активность с предыдущего элемента, если он существует
        if (this.activeItem) {
            console.log(`Деактивация элемента: ${this.activeItem.data.label}`);
            this.activeItem.data.activate = false;
        }

        // 2. Устанавливаем новый активный элемент
        this.activeItem = item;
        this.activeItem.data.activate = true;
        console.log(`Активация элемента: ${item.data.label}`);
    }

    // Вспомогательный метод для демонстрации (printTree) остается прежним
    public printTree(nodes: TreeItem[] = this.roots, level: number = 0): void {
        const indent = '  '.repeat(level);
        nodes.forEach(node => {
            console.log(`${indent}- ${node.data.label} (Value: ${node.data.value}, Active: ${node.data.activate})`);
            if (node.children.length > 0) {
                this.printTree(node.children, level + 1);
            }
        });
    }

    /**
     * Приватный рекурсивный метод поиска элемента по значению (value)
     * Использует алгоритм поиска в глубину (Depth-First Search).
     * @param value Искомое значение.
     * @param nodes Текущий массив узлов для поиска (начинается с roots).
     * @returns Найденный TreeItem или null.
     */
    private findItemByValue(value: string | number, nodes: TreeItem[]): TreeItem | null {
        // Мы перебираем текущий уровень узлов
        for (const node of nodes) {
            if (node.data.value === value) {
                return node; // Элемент найден!
            }
            // Если у элемента есть дети, рекурсивно ищем среди них
            if (node.children.length > 0) {
                const foundInChild = this.findItemByValue(value, node.children);
                if (foundInChild) {
                    return foundInChild; // Элемент найден во вложенном уровне
                }
            }
        }
        return null; // Элемент не найден в текущей ветке
    }

    /**
     * Публичный метод для активации элемента по его уникальному значению.
     * @param value Значение (value) элемента, который нужно активировать.
     */
    public setActiveItemByValue(value: string | number): boolean {
        const itemToActivate = this.findItemByValue(value, this.roots);

        if (itemToActivate) {
            this.setActiveItem(itemToActivate);
            return true; // Успешно активирован
        } else {
            console.warn(`Элемент с value "${value}" не найден в коллекции.`);
            return false; // Элемент не найден
        }
    }

    /**
     * Устанавливает новый активный элемент (логика из предыдущего ответа)
     * @param item Новый активный элемент.
     */
    public setActiveItem(item: TreeItem): void {
        if (this.activeItem === item) {
            return;
        }

        if (this.activeItem) {
            this.activeItem.data.activate = false;
        }

        this.activeItem = item;
        this.activeItem.data.activate = true;
        console.log(`Активация элемента: ${item.data.label} (Value: ${item.data.value})`);
    }
}


// --- Пример использования ---

// 1. Создаем экземпляр коллекции
const menuCollection = new TreeCollection([]);

// 2. Создаем узлы (элементы меню)
const itemHome = new TreeItem({ value: 'home', activate: true, label: 'Главная' });
const itemAbout = new TreeItem({ value: 'about', activate: false, label: 'О нас' });
const itemServices = new TreeItem({ value: 'services', activate: false, label: 'Услуги' });
const itemContact = new TreeItem({ value: 'contact', activate: false, label: 'Контакты' });

// 3. Создаем вложенные элементы
const itemService1 = new TreeItem({ value: 'service1', activate: false, label: 'Услуга 1' });
const itemService2 = new TreeItem({ value: 'service2', activate: false, label: 'Услуга 2' });

// 4. Строим иерархию
itemServices.addChild(itemService1);
itemServices.addChild(itemService2);

// 5. Добавляем корневые элементы в коллекцию
menuCollection.addRoot(itemHome);
menuCollection.addRoot(itemAbout);
menuCollection.addRoot(itemServices);
menuCollection.addRoot(itemContact);

console.log('--- Исходное состояние дерева ---');
menuCollection.printTree();
console.log('Текущий активный элемент:', menuCollection.getActiveItem()?.data.label);

// 6. Меняем активный элемент (с "Главная" на "О нас")
console.log('\n--- Смена активности на "О нас" ---');
menuCollection.setActiveItem(itemAbout);

console.log('\n--- Состояние дерева после смены активности ---');
menuCollection.printTree();
console.log('Текущий активный элемент:', menuCollection.getActiveItem()?.data.label);

// 7. Меняем активность на вложенный элемент ("Услуга 2")
console.log('\n--- Смена активности на "Услуга 2" (вложенный элемент) ---');
menuCollection.setActiveItem(itemService2);

console.log('\n--- Итоговое состояние дерева ---');
menuCollection.printTree();
console.log('Текущий активный элемент:', menuCollection.getActiveItem()?.data.label);

// Активируем элемент, используя только его строковое значение 'service1'
console.log('\n--- Активация через value: "service1" ---');
menuCollection.setActiveItemByValue('service1');

console.log('\n--- Состояние после активации по value ---');
menuCollection.printTree();
console.log('Текущий активный элемент:', menuCollection.getActiveItem()?.data.label);

// Попытка активировать несуществующее значение
console.log('\n--- Попытка активации несуществующего value ---');
menuCollection.setActiveItemByValue('non_existent_page');

