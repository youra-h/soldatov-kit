<script lang="ts">
import { TControl, type IControl } from '../../../core/control'
import BaseControl from './base.component'
import { baseSetup } from './../component'

export default {
	name: '_Control',
	extends: BaseControl,
	setup(props: IControl) {
		return baseSetup(TControl, props)
	},
}
</script>
