import type { TProps } from '../types/common'

interface IWithDefaultValues {
	defaultValues: Record<string, unknown>
}

/**
 * Берёт родительские props и автоматически подменяет default
 * на значения из ChildCtor.defaultValues, если они отличаются от родительских.
 *
 * Позволяет наследникам не переписывать type/default для унаследованных свойств —
 * достаточно переопределить static defaultValues в core-классе.
 *
 * @example
 * ```ts
 * export const propsSkeleton: TProps = {
 *     ...useInheritProps(propsStylable, TSkeleton),
 *     shape: { type: String, default: TSkeleton.defaultValues.shape },
 * }
 * ```
 */
export function useInheritProps(
	parentProps: TProps,
	ChildCtor: IWithDefaultValues,
): TProps {
	const childDefaults = ChildCtor.defaultValues
	const result: Record<string, any> = { ...parentProps }

	for (const key of Object.keys(result)) {
		const parentDef = result[key]
		const childDefault = childDefaults[key]

		if (
			key in childDefaults &&
			parentDef != null &&
			typeof parentDef === 'object' &&
			'default' in parentDef &&
			(parentDef as { default: unknown }).default !== childDefault
		) {
			result[key] = { ...parentDef, default: childDefault }
		}
	}

	return result as TProps
}
