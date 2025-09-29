<script lang="ts">
import { TControlInput, type IControlInput } from '../../../core'
import BaseControlInput, { syncControlInput } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'

export default {
	name: '_ControlInput',
	extends: BaseControlInput,
	setup(props: IControlInput, { emit }) {
		const { is: component } = useBaseSetup(TControlInput, props)

		syncControlInput({
			props,
			instance: component,
			emit,
		})

		return { component }
	},
}
</script>
