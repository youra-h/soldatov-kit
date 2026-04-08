<script lang="ts">
import { TTabs, type ITabsProps } from '@core'
import BaseTabs, { syncTabs } from './base.component'
import { useBaseSetup } from '../../composables/useBaseSetup'
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

		const items = instance.collection.getItems()

		return { instance, items }
	},
}
</script>

<template>
	{{ instance.classes }}
	<div v-if="instance.rendered" v-show="instance.visible" :class="instance.classes">
		<div class="s-tabs__list" role="tablist">
			<tab-item v-for="item in items" :key="item.uid" :is="item" />
		</div>

		<!-- Слот для контента табов -->
		<div class="s-tabs__content">
			<slot :activeItem="instance.activeItem" :items="items" />
		</div>
	</div>
</template>

<style lang="scss">
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
		@apply flex gap-1;
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
		#{$this}__list {
		}

		.s-tab-item {
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
