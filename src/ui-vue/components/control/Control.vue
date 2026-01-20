<script lang="ts">
import { TControl, type IControlProps } from '../../../core'
import { useBaseSetup } from '../../composables/useBaseSetup'

export default {
	name: '_Control',
	extends: BaseControl,
	setup(props: IControlProps, { emit }) {
		const { is: instance } = useBaseSetup(TControl, props)

		syncControl({
			props,
			instance,
			emit,
		})

		return { instance }
	},
}
</script>
