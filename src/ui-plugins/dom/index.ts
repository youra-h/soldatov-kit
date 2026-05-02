import { TPluginContainer } from '../base/plugin-container.class'
import { TDomPlugin } from './dom.plugin'
import { TCorePlugin } from '../core/core.plugin'
import { TLineIndicatorPlugin } from '../tabs/line-indicator.plugin'

// 1. Создаем контейнер
const container = new TPluginContainer()

// 2. Добавляем плагины
container.use(TDomPlugin)
container.use(TCorePlugin)
container.use(TLineIndicatorPlugin)

// 3. Vue передает `el` (в onMounted)
const domPlugin = container.get<TDomPlugin>(TDomPlugin.key)
if (domPlugin) {
	domPlugin.setContext({ el: document.createElement('div') })
}

// 4. Vue передает `instance` (в setup)
const corePlugin = container.get<TCorePlugin>(TCorePlugin.key)
if (corePlugin) {
	corePlugin.setContext({ instance: { events: { on: () => {} } } })
}

// Vue: при unmount отписывается и уничтожает el
container.remove(TDomPlugin.key)
container.remove(TCorePlugin.key)
container.remove(TLineIndicatorPlugin.key)
