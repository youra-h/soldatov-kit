<script lang="ts">
import { TComponent, type IComponent } from '../../../core/component'
import BaseComponent, { baseSetup } from './base.component'

export default {
	name: '_Component',
	extends: BaseComponent,
	setup(props: IComponent) {
		return baseSetup(TComponent, props)
	},
}
</script>
