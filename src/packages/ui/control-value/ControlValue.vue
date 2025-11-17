<script lang="ts">
import { TControlValue, type IControlValueProps } from '../../../core'
import BaseControlValue, { syncControlValue } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'

export default {
	name: '_ControlValue',
	extends: BaseControlValue,
	setup(props: IControlValueProps, { emit }) {
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
