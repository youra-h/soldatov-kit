<script lang="ts">
import { TControl, type IControl } from '../../../core'
import BaseControl, { syncControl } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'

export default {
	name: '_Control',
	extends: BaseControl,
	setup(props: IControl) {
		const { component } = useBaseSetup(TControl, props)

		syncControl(props, component)

		return { component }
	},
}
</script>
