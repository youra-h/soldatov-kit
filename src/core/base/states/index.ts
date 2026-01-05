/**
 * Набор state-units (модулей состояния) для headless-ядра.
 *
 * State-unit:
 * - хранит небольшое изолированное состояние
 * - имеет собственные `events`
 * - обычно используется компонентом-агрегатом, который подписывается и пробрасывает события наружу
 */
export * from './disableable.state'
export * from './focusable.state'
export * from './text.state'
export * from './value.state'
export * from './input-state.state'
