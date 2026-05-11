import { TPluginBundle } from '../../base/bundle'
import { TElementPlugin } from '../../common/element'
import { TInstancePlugin } from '../../common/instance'
import { TReadyBridgePlugin } from '../../common/ready-bridge'

export class TComponentViewBundle extends TPluginBundle {
	constructor() {
		super()
		this.use(TElementPlugin)
		this.use(TInstancePlugin)
		this.use(TReadyBridgePlugin)
	}
}
