<script lang="ts">
import { TControl, type IControl } from '../../../core/control'
import BaseControl, { useControlWatchers } from './base.component'
import { useBaseSetup } from './../../core/useBaseSetup'

export default {
	name: '_Control',
	extends: BaseControl,
	setup(props: IControl) {
		const { component } = useBaseSetup(TControl, props)

		useControlWatchers(props, component)

		return { component }
	},
}
</script>
