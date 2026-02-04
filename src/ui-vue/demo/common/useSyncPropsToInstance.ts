import { watch, type UnwrapRef } from 'vue'

/**
 * Универсальный композабл для синхронизации props с instance
 * Автоматически создает watchers для всех указанных свойств
 *
 * @param props - объект props компонента
 * @param instance - reactive instance (TComponentView, TIcon и т.д.)
 * @param keysToSync - массив ключей для синхронизации (если не указан, синхронизируются все ключи props)
 * @param transform - опциональная функция трансформации значений перед присваиванием
 *
 * @example
 * ```ts
 * const instance = reactive(new TIcon({ ... }))
 *
 * // Синхронизировать все props
 * useSyncPropsToInstance(props, instance)
 *
 * // Синхронизировать только указанные props
 * useSyncPropsToInstance(props, instance, ['visible', 'rendered', 'size'])
 *
 * // С трансформацией значений
 * useSyncPropsToInstance(props, instance, ['tag'], {
 *   tag: (value) => useIconImport(value)
 * })
 * ```
 */
export function useSyncPropsToInstance<
	TProps extends Record<string, any>,
	TInstance extends Record<string, any>,
>(
	props: TProps,
	instance: UnwrapRef<TInstance>,
	keysToSync?: (keyof TProps)[],
	transform?: Partial<Record<keyof TProps, (value: any) => any>>,
) {
	const keys = keysToSync || (Object.keys(props) as (keyof TProps)[])

	keys.forEach((key) => {
		const transformFn = transform?.[key]

		watch(
			() => props[key],
			(newVal) => {
				if (newVal === undefined) return

				const valueToSet = transformFn ? transformFn(newVal) : newVal

				// Проверяем, изменилось ли значение (чтобы избежать лишних апдейтов)
				if (instance[key as keyof typeof instance] !== valueToSet) {
					;(instance as any)[key] = valueToSet
				}
			},
		)
	})
}
