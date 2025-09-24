<script lang="ts">
import { TCheckBox, type ICheckBox } from '../../../core'
import BaseCheckBox, { syncCheckBox } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'

export default {
	name: '_CheckBox',
	extends: BaseCheckBox,
	setup(props: ICheckBox) {
		const { is: component } = useBaseSetup(TCheckBox, props)

		syncCheckBox(props, component)

		return { component }
	},
}
</script>
