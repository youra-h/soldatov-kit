<script lang="ts">
import { TTabs, type ITabsProps } from '@core'
import { computed } from 'vue'
import BaseTabs, { syncTabs } from './base.component'
import { useBaseSetup } from '../../composables/useBaseSetup'
import { useElementSync } from '../../composables/useElementSync'
import { useProvideCollection } from '../../composables/useProvideCollection'
import { useCollectionItems } from '../../composables/useCollectionItems'
import { TabItem } from './tab-item'

export default {
	name: '_Tabs',
	extends: BaseTabs,
	components: { TabItem },
	setup(props: ITabsProps, { emit }) {
		const { is: instance } = useBaseSetup(TTabs, props)

		syncTabs({
			props,
			instance,
			emit,
		})

		useProvideCollection(instance.collection)

		const items = useCollectionItems(instance.collection)

		const rootRef = useElementSync(instance)

		const activeItem = computed(() => instance.collection.activeItem ?? null)
		const activeValue = computed(() => activeItem.value?.value ?? null)

		return { instance, items, rootRef, activeItem, activeValue }
	},
}
</script>

<template>
	{{  activeValue }}
	<div ref="rootRef" v-if="instance.rendered" v-show="instance.visible" :class="instance.classes">
		<div class="s-tabs__list" role="tablist">
			<slot>
				<TabItem v-for="item in items" :key="item.uid" :is="item" />
			</slot>
		</div>
		<div v-if="activeItem && $slots[`panel:${activeValue}`]" class="s-tabs__panel">
			<slot :name="`panel:${activeValue}`" />
		</div>
	</div>
</template>

<style lang="scss">
@use './mixines' as mixines;
@reference "./../../../foundation/tailwind";

.s-tabs {
	$this: &;

	@apply flex w-full;

	// Ориентация
	&--horizontal {
		@apply flex-col;

		#{$this}__list {
			@apply flex-row;
		}
	}

	&--vertical {
		@apply flex-row;

		#{$this}__list {
			@apply flex-col;
		}

		&#{$this}--position-end {
			@apply flex-row-reverse;
		}
	}

	// Список табов
	&__list {
		@apply flex gap-4;
	}

	// Панель
	&__panel {
		@apply my-2.5;
	}

	// Выравнивание
	&--center #{$this}__list {
		@apply justify-center;
	}

	&--end #{$this}__list {
		@apply justify-end;
	}

	&--stretch #{$this}__list {
		@apply justify-between;
	}

	// Stretched - табы занимают всю ширину
	&--stretched {
		.s-tab-item {
			@apply flex-1 justify-center;
		}
	}

	// Внешний вид
	&--line {
		// Список: разделитель, relative для ::after
		#{$this}__list {
			@apply relative border-b;

			// Индикатор через ::after, позиция через CSS custom properties
			&::after {
				content: '';
				@apply absolute left-0 h-0.5;
				@apply -bottom-px;
				@apply rounded-full;
				width: var(--underline-width, 0px);
				transform: translateX(var(--underline-x, 0px));
			}
		}

		// Transition включается только после монтирования (--ready добавляется core через el setter)
		&#{$this}--ready #{$this}__list::after {
			transition:
				transform 0.2s ease,
				width 0.2s ease;
		}

		// Табы: без скруглений, перекрывают нижнюю линию
		.s-tab-item {
			@apply rounded-none -mb-px;
		}

		// Normal (default)
		&#{$this}--normal {
			@include mixines.tabs-line-variant('neutral');
		}

		&#{$this}--accent {
			@include mixines.tabs-line-variant('accent');
		}

		&#{$this}--positive {
			@include mixines.tabs-line-variant('positive');
		}

		&#{$this}--negative {
			@include mixines.tabs-line-variant('negative');
		}

		&#{$this}--caution {
			@include mixines.tabs-line-variant('caution');
		}
	}

	&--pills {
		.s-tab-item {
			&--active {
			}
		}
	}

	&--contained {
		#{$this}__list {
		}

		.s-tab-item {
			&--active {
			}
		}
	}

	&--segmented {
		#{$this}__list {
		}

		.s-tab-item {
			&--active {
			}
		}
	}

	// Контент
	&__content {
		@apply flex-1 p-4;
	}

	// Отключенное состояние
	&:disabled,
	&--disabled {
		@apply opacity-50 pointer-events-none;
	}
}
</style>
