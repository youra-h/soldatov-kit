<script lang="ts">
import { TControlInput, type IControlInputProps } from '../../../core'
import BaseControlInput, { syncControlInput } from './base.component'
import { useBaseSetup } from '../../composables/useBaseSetup'

export default {
	name: '_ControlInput',
	extends: BaseControlInput,
	setup(props: IControlInputProps, { emit }) {
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
