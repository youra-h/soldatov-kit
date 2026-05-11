import { TComponentViewBundle } from '../component-view'
import { TTabsAppearancePlugin } from './plugins/appearance'

export class TTabsBundle extends TComponentViewBundle {
	constructor() {
		super()
		this.use(TTabsAppearancePlugin)
	}
}
