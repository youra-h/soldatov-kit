import { TPluginContainer } from '../../base/container'
import { TElementPlugin } from '../../common/element'
import { TInstancePlugin } from '../../common/instance'

export class TComponentViewContainer extends TPluginContainer {
	constructor() {
		super()
		this.use(TElementPlugin)
		this.use(TInstancePlugin)
	}
}
