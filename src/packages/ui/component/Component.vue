<script lang="ts">
import { TComponent, type IComponent } from '../../../core/component'
import BaseComponent from './base.component'
import { useBaseSetup } from './../../core/useBaseSetup'

export default {
	name: '_Component',
	extends: BaseComponent,
	setup(props: IComponent) {
		const { component } = useBaseSetup(TComponent, props)

		return { component }
	},
}
</script>
