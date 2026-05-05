import { TPluginContainer } from '../../base/container'
import { TElementPlugin } from '../../common/element'
import { TInstancePlugin } from '../../common/instance'
import { TReadyBridgePlugin } from '../../common/ready-bridge'

export class TComponentViewContainer extends TPluginContainer {
	constructor() {
		super()
		this.use(TElementPlugin)
		this.use(TInstancePlugin)
		this.use(TReadyBridgePlugin)
	}
}
