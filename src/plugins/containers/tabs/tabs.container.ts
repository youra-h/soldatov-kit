import { TComponentViewContainer } from '../component-view'
import { TTabsUnderlinePlugin } from './plugins/underline'

export class TTabsContainer extends TComponentViewContainer {
	constructor() {
		super()
		this.use(TTabsUnderlinePlugin)
	}
}
