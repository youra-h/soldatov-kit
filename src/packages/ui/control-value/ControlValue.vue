<script lang="ts">
import { TControlValue, type IControlValue } from '../../../core'
import BaseControlValue, { syncControlValue } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'

export default {
	name: '_ControlValue',
	extends: BaseControlValue,
	setup(props: IControlValue, { emit }) {
		const { is: component } = useBaseSetup(TControlValue, props)

		syncControlValue({
			props,
			instance: component,
			emit,
		})

		return { component }
	},
}
</script>
