import { TEventEmitter, type TEventHandler } from './event-emitter'

/**
 * Описание правила проброса одного события из источника.
 *
 * @template TSource - события источника
 * @template TTarget - события цели (текущего эмиттера)
 */
export type TRelayRule<
	TSource extends Record<string, (...args: any) => any>,
	TTarget extends Record<string, (...args: any) => any>,
> = {
	/** Имя события в источнике */
	from: keyof TSource
	/**
	 * Имя события в цели. Если не указано — используется то же имя, что и `from`.
	 * Используется для переименования событий при проброске.
	 *
	 * @example
	 * // Пробросить item:added как tab:added
	 * { from: 'item:added', as: 'tab:added' }
	 */
	as?: keyof TTarget
	/**
	 * Хук, вызываемый **до** проброса события в цель.
	 * Удобен для подписки на события нового элемента сразу в момент его добавления —
	 * до того, как внешний код узнает о событии.
	 *
	 * @example
	 * {
	 *   from: 'item:added',
	 *   then: ({ item }) => {
	 *     item.events.on('change:disabled', (value) => {
	 *       this.events.emit('item:disabled', item, value)
	 *     })
	 *   }
	 * }
	 */
	then?: (...args: any[]) => void
}

export class TEvented<TEvents extends Record<string, (...args: any) => any>> {
	private _items: TEventEmitter<TEvents> = new TEventEmitter()

	/**
	 * Подписка на событие
	 * @param event - имя события
	 * @param handler - обработчик события
	 */
	on<K extends keyof TEvents>(event: K, handler: TEvents[K]): void {
		this._items.on(event, handler)
	}

	/**
	 * Отписка от события
	 * @param event - имя события
	 * @param handler - обработчик события
	 */
	off<K extends keyof TEvents>(event: K, handler: TEvents[K]): void {
		this._items.off(event, handler)
	}

	/**
	 * Вызов события
	 * @param event - имя события
	 * @param args - аргументы события
	 */
	emit<K extends keyof TEvents>(event: K, ...args: Parameters<TEvents[K]>): void {
		this._items.emit(event, ...args)
	}

	/**
	 * Выполняет событие и возвращает результат выполнения обработчиков
	 * @param event
	 * @param args
	 * @returns {boolean}
	 */
	emitWithResult<K extends keyof TEvents>(event: K, ...args: Parameters<TEvents[K]>): boolean {
		return this._items.emitWithResult(event, ...args)
	}

	/**
	 * Выполняет событие и возвращает первый не-undefined результат (short-circuit).
	 */
	emitResolve<T, K extends keyof TEvents>(
		event: K,
		...args: Parameters<TEvents[K]>
	): T | undefined {
		return this._items.emitResolve<T, K>(event, ...args)
	}

	/**
	 * Выполняет событие и возвращает все не-undefined результаты обработчиков.
	 */
	emitResolveAll<T, K extends keyof TEvents>(event: K, ...args: Parameters<TEvents[K]>): T[] {
		return this._items.emitResolveAll<T, K>(event, ...args)
	}

	/**
	 * Декларативный маппинг событий из источника (`source`) в текущий эмиттер.
	 *
	 * Каждый элемент массива `rules` — либо строка (имя события, пробрасывается как есть),
	 * либо объект `TRelayRule` с расширенными возможностями:
	 * - `as` — переименовать событие при проброске
	 * - `then` — хук, вызываемый **до** проброса (удобно для подписки на дочерние события)
	 *
	 * @param source - источник событий (другой `TEvented`)
	 * @param rules  - список правил проброса
	 *
	 * @example
	 * // Простой проброс нескольких событий без изменений:
	 * this.events.relay(this._collection.events, [
	 *   'item:beforeDelete',
	 *   'item:deleted',
	 *   'cleared',
	 * ])
	 *
	 * @example
	 * // Переименование события:
	 * this.events.relay(this._collection.events, [
	 *   { from: 'item:added', as: 'tab:added' },
	 * ])
	 *
	 * @example
	 * // Хук then — подписаться на события нового элемента до его появления снаружи:
	 * this.events.relay(this._collection.events, [
	 *   {
	 *     from: 'item:added',
	 *     then: ({ item }) => {
	 *       item.events.on('change:disabled', (value) => {
	 *         this.events.emit('item:disabled', item, value)
	 *       })
	 *     },
	 *   },
	 * ])
	 *
	 * @example
	 * // Комбинация: переименование + хук:
	 * this.events.relay(this._collection.events, [
	 *   {
	 *     from: 'item:added',
	 *     as: 'tab:added',
	 *     then: ({ item }) => {
	 *       item.size = this.size
	 *     },
	 *   },
	 *   'item:deleted',
	 * ])
	 */
	relay<TSource extends Record<string, (...args: any) => any>>(
		source: TEvented<TSource>,
		rules: (keyof TSource | TRelayRule<TSource, TEvents>)[],
	): void {
		// Внутри relay используем неограниченные типы — безопасность обеспечивается
		// на уровне TRelayRule и сигнатуры метода, а не внутри реализации.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const src = source as TEvented<any>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const tgt = this as TEvented<any>
		for (const rule of rules) {
			if (typeof rule === 'string' || typeof rule === 'symbol') {
				src.on(rule as any, (...args: any[]) => tgt.emit(rule as any, ...args))
			} else {
				const { from, as: targetEvent, then: hook } = rule as TRelayRule<TSource, TEvents>
				const target = targetEvent ?? from
				src.on(from as any, (...args: any[]) => {
					hook?.(...args)
					tgt.emit(target as any, ...args)
				})
			}
		}
	}
}
