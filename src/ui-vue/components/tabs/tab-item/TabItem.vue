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
.s-tab-item {
	$this: &;

	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	cursor: pointer;
	user-select: none;
	position: relative;

	&__text {
		display: inline-flex;
		align-items: center;
	}

	&__close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.125rem;
		border: none;
		background: transparent;
		cursor: pointer;
		border-radius: 0.25rem;

		&:hover {
			background: rgba(0, 0, 0, 0.05);
		}
	}

	&--closable {
		padding-right: 0.5rem;
	}

	&:disabled,
	&--disabled {
		opacity: 0.5;
		cursor: default;
		pointer-events: none;
	}
}
</style>
