<script lang="ts">
import { TControl, type IControl } from '../../../core'
import BaseControl, { syncControl } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'

export default {
	name: '_Control',
	extends: BaseControl,
	setup(props: IControl, { emit }) {
		const { is: component } = useBaseSetup(TControl, props)

		syncControl({
			instance: component,
			props,
			emit,
		})

		return { component }
	},
}
</script>
