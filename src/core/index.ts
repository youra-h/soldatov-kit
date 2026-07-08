// base (слои/ядро)
export * from './components/base'
export * from './common/state-unit'
export * from './common/states'
export * from './common/size'

// components (headless компоненты)
export * from './components/custom'

// common (вспомогательные утилиты)
export * from './common/is-same'
export * from './common/evented'
export * from './common/event-emitter'
export * from './common/classes'
export * from './common/frame-debounce'
export type {
	TComponentSize,
	TComponentVariant,
	TValuePayload,
	TScrollBehavior,
} from './common/types'
