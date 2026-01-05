export {
	TModifierValue,
	type IModifierValueOptions,
	type TModifierValueEvents,
} from '../base/states/modifier-value.state'

/**
 * @deprecated Используйте `TModifierValue`.
 */
export { TModifierValue as TBaseClassValue } from '../base/states/modifier-value.state'

/**
 * @deprecated Используйте `IModifierValueOptions`.
 */
export type IBaseClassValueOptions<T extends string = string> = import('../base/states/modifier-value.state').IModifierValueOptions<T>

/**
 * @deprecated Используйте `TModifierValueEvents`.
 */
export type TBaseClassValueEvents<T extends string = string> = import('../base/states/modifier-value.state').TModifierValueEvents<T>
