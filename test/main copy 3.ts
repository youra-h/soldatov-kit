// Интерфейс элемента дерева
interface ITreeCollectionItem {
  value: string;
  activate: boolean;
  children: ITreeCollectionItem[];
}

// Класс элемента дерева
class TTreeItem implements ITreeCollectionItem {
  value: string;
  activate: boolean;
  children: TTreeItem[];

  constructor(value: string, activate: boolean = false) {
    this.value = value;
    this.activate = activate;
    this.children = [];
  }

  addChild(child: TTreeItem): void {
    this.children.push(child);
  }
}

// Класс коллекции дерева
class TTree {
  private items: TTreeItem[] = [];

  addItem(item: TTreeItem): void {
    this.items.push(item);
  }

  // Снять активность со всех элементов
  private deactivateAll(items: TTreeItem[]): void {
    for (const item of items) {
      item.activate = false;
      if (item.children.length > 0) {
        this.deactivateAll(item.children);
      }
    }
  }

  // Установить активный элемент по значению
  setActive(value: string): void {
    this.deactivateAll(this.items);
    this.findAndActivate(this.items, value);
  }

  // Рекурсивный поиск и активация
  private findAndActivate(items: TTreeItem[], value: string): boolean {
    for (const item of items) {
      if (item.value === value) {
        item.activate = true;
        return true;
      }
      if (item.children.length > 0) {
        if (this.findAndActivate(item.children, value)) {
          return true;
        }
      }
    }
    return false;
  }

  // Получить текущий активный элемент
  getActive(): TTreeItem | null {
    return this.findActive(this.items);
  }

  private findActive(items: TTreeItem[]): TTreeItem | null {
    for (const item of items) {
      if (item.activate) {
        return item;
      }
      if (item.children.length > 0) {
        const activeChild = this.findActive(item.children);
        if (activeChild) return activeChild;
      }
    }
    return null;
  }

  // Для тестов: печать дерева
  print(items: TTreeItem[] = this.items, level: number = 0): void {
    for (const item of items) {
      console.log(`${" ".repeat(level * 2)}- ${item.value} ${item.activate ? "(active)" : ""}`);
      if (item.children.length > 0) {
        this.print(item.children, level + 1);
      }
    }
  }
}


// Создаем коллекцию
const tree = new TTree();

// Верхний уровень
const fileMenu = new TTreeItem("File");
const editMenu = new TTreeItem("Edit");
const viewMenu = new TTreeItem("View");

// Добавляем в коллекцию
tree.addItem(fileMenu);
tree.addItem(editMenu);
tree.addItem(viewMenu);

// Вложенные элементы
const newFile = new TTreeItem("New");
const openFile = new TTreeItem("Open");
const saveFile = new TTreeItem("Save");

fileMenu.addChild(newFile);
fileMenu.addChild(openFile);
fileMenu.addChild(saveFile);

const undoEdit = new TTreeItem("Undo");
const redoEdit = new TTreeItem("Redo");
editMenu.addChild(undoEdit);
editMenu.addChild(redoEdit);

const zoomIn = new TTreeItem("Zoom In");
const zoomOut = new TTreeItem("Zoom Out");
viewMenu.addChild(zoomIn);
viewMenu.addChild(zoomOut);

// Тесты
console.log("=== Начальное дерево ===");
tree.print();

console.log("\n=== Активируем 'Open' ===");
tree.setActive("Open");
tree.print();
console.log("Текущий активный:", tree.getActive()?.value);

console.log("\n=== Активируем 'Redo' ===");
tree.setActive("Redo");
tree.print();
console.log("Текущий активный:", tree.getActive()?.value);

console.log("\n=== Активируем 'View' ===");
tree.setActive("View");
tree.print();
console.log("Текущий активный:", tree.getActive()?.value);
