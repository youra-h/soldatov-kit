import { TComponentViewContainer } from '../component-view'
import { TTabsAppearancePlugin } from './plugins/appearance'

export class TTabsContainer extends TComponentViewContainer {
	constructor() {
		super()
		this.use(TTabsAppearancePlugin)
	}
}
