<script lang="ts">
import { TCheckBox, type ICheckBox } from '../../../core'
import BaseCheckBox, { syncCheckBox } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'

export default {
	name: '_CheckBox',
	extends: BaseCheckBox,
	setup(props: ICheckBox, { emit }) {
		const { is: component } = useBaseSetup(TCheckBox, props)

		syncCheckBox({
			props,
			instance: component,
			emit,
		})

		return { component }
	},
}
</script>
