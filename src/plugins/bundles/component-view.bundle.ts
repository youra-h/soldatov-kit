import { TPluginBundle } from '../base/bundle'
import { TElementPlugin } from '../common/element'
import { TInstancePlugin } from '../common/instance'
import { TReadyBridgePlugin } from '../common/ready-bridge'

export function createComponentViewBundle() {
	return new TPluginBundle()
		.use(TElementPlugin)
		.use(TInstancePlugin)
		.use(TReadyBridgePlugin)
}
