<script lang="ts">
import { TTabItem, type ITabItemProps } from '../../../../core'
import BaseTabItem, { syncTabItem } from './tab-item.component'
import { useBaseSetup } from '../../../composables/useBaseSetup'
import { Icon, useIconImport } from '../../icon'

export default {
	name: '_TabItem',
	extends: BaseTabItem,
	components: { Icon },
	setup(props: ITabItemProps, { emit }) {
		const { is: instance } = useBaseSetup(TTabItem, props)

		syncTabItem({
			props,
			instance,
			emit,
		})

		// Иконка закрытия
		const closeIconTag = useIconImport('../../icons/close.svg')

		return { instance, closeIconTag }
	},
}
</script>

<template>
	<div
		v-if="instance.rendered"
		v-show="instance.visible"
		:class="instance.classes"
		@click="instance.click($event)"
	>
		<!-- Слот для текста -->
		<span class="s-tab-item__text">
			<slot :text="instance.text" :active="instance.active">
				{{ instance.text }}
			</slot>
		</span>

		<!-- Кнопка закрытия -->
		<button
			v-if="instance.closable !== false"
			type="button"
			class="s-tab-item__close"
			@click.stop="instance.close()"
			:aria-label="'Close'"
		>
			<slot name="close-icon">
				<Icon :tag="closeIconTag" :size="instance.size" />
			</slot>
		</button>
	</div>
</template>

<style lang="scss">
@reference "./../../../../foundation/tailwind";

.s-tab-item {
	$this: &;

	@apply inline-flex items-center gap-2;
	@apply px-4 py-2;
	@apply cursor-pointer select-none;
	@apply relative;

	&__text {
		@apply inline-flex items-center;
	}

	&__close {
		@apply inline-flex items-center justify-center;
		@apply p-0.5;
		@apply border-none bg-transparent;
		@apply cursor-pointer rounded;

		&:hover {
			@apply bg-black/5;
		}
	}

	&--closable {
		@apply pr-2;
	}

	&:disabled,
	&--disabled {
		@apply opacity-50 cursor-default pointer-events-none;
	}
}
</style>
