import { TUiSync } from '../base/ui-sync.class'
import { TLineIndicatorHandler } from './handlers/line-indicator.handler'
import type { ITabs } from '../../core/components/tabs/types'

/**
 * Координатор DOM-синхронизации для компонента TTabs.
 *
 * Регистрирует все обработчики, специфичные для табов.
 * Создаётся в setup() Vue-компонента, el передаётся через useElementSync().
 *
 * @example
 * const sync = new TUiSyncTabs(instance)
 * const rootRef = useElementSync(sync)
 */
export class TUiSyncTabs extends TUiSync {
	constructor(instance: ITabs) {
		super()
		this.use(new TLineIndicatorHandler(instance))
	}
}
