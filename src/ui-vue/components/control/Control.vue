<script lang="ts">
import { TControl, type IControlProps } from '../../../core'
import BaseControl, { syncControl } from './base.component'
import { useBaseSetup } from '../../composables/useBaseSetup'

export default {
	name: '_Control',
	extends: BaseControl,
	setup(props: IControlProps, { emit }) {
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
