import type { IPluginBundle, TBundleFactory } from '@plugins'

/**
 * Утилита для создания и использования плагин-бандлов в компонентах Vue.
 * Позволяет легко интегрировать бандлы, созданные через фабрики, и обеспечивает обратную совместимость с существующими бандлами.
 * @param factoryOrBundle - фабрика бандла или уже готовый бандл
 * @param existingBundle - существующий бандл, который будет использоваться вместо созданного (для обратной совместимости)
 * @returns
 */
export function useBundle(
	factoryOrBundle: TBundleFactory | IPluginBundle,
	existingBundle?: IPluginBundle,
): IPluginBundle {
	// если передана фабрика – вызываем, иначе считаем, что это уже бандл
	const bundleresolve = () =>
		typeof factoryOrBundle === 'function' ? factoryOrBundle() : factoryOrBundle

	// если есть existingBundle – используем его, иначе созданный (это для обратной совместимости)
	return existingBundle ?? bundleresolve()
}
