/**
 * Набор state-units (модулей состояния) для headless-ядра.
 *
 * State-unit:
 * - хранит небольшое изолированное состояние
 * - имеет собственные `events`
 * - обычно используется компонентом-агрегатом, который подписывается и пробрасывает события наружу
 */
export * from './modifier-value.state'
export * from './size.state'
export * from './input-state.state'
export * from './variant.state'
export * from './visibility.state'
export * from './types'
