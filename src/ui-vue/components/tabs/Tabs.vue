<script lang="ts">
import { TTabs, type ITabsProps, type ITabItem } from '../../../core'
import BaseTabs, { syncTabs } from './base.component'
import { useBaseSetup } from '../../composables/useBaseSetup'
import { TabItem } from './tab-item'
import { computed } from 'vue'

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

		// Преобразуем коллекцию в reactive массив
		const items = computed(() => instance.collection.toArray<ITabItem>())

		return { instance, items }
	},
}
</script>

<template>
	<div v-if="instance.rendered" v-show="instance.visible" :class="instance.classes">
		<div class="s-tabs__list" role="tablist">
			<!-- Рендерим табы из коллекции -->
			<TabItem
				v-for="(item, index) in items"
				:key="item.id || index"
				:is="item"
				:closable="instance.isTabClosable(item)"
				:class="{
					's-tab-item--active': item.active,
				}"
				@click="instance.collection.setActive(item)"
				@close="instance.closeTab(item)"
			>
				<!-- Пробрасываем слоты -->
				<template #default="slotProps">
					<slot name="tab-item" v-bind="{ ...slotProps, item, index }">
						{{ item.text }}
					</slot>
				</template>
				<template #close-icon>
					<slot name="close-icon" v-bind="{ item, index }" />
				</template>
			</TabItem>
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
			@apply border-b border-gray-200;
		}

		.s-tab-item {
			@apply border-b-2 border-transparent;

			&--active {
				@apply border-blue-500;
			}
		}
	}

	&--pills {
		.s-tab-item {
			@apply rounded-md;

			&--active {
				@apply bg-blue-50;
			}
		}
	}

	&--contained {
		#{$this}__list {
			@apply bg-gray-50;
			@apply p-1 rounded-lg;
		}

		.s-tab-item {
			@apply rounded-md;

			&--active {
				@apply bg-white shadow-sm;
			}
		}
	}

	&--segmented {
		#{$this}__list {
			@apply border border-gray-200;
			@apply rounded-lg p-1 gap-0;
		}

		.s-tab-item {
			@apply rounded-md m-0;

			&--active {
				@apply bg-blue-500 text-white;
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
