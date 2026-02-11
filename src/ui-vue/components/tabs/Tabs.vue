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
.s-tabs {
	$this: &;

	display: flex;
	width: 100%;

	// Ориентация
	&--horizontal {
		flex-direction: column;

		#{$this}__list {
			flex-direction: row;
		}
	}

	&--vertical {
		flex-direction: row;

		#{$this}__list {
			flex-direction: column;
		}

		&#{$this}--position-end {
			flex-direction: row-reverse;
		}
	}

	// Список табов
	&__list {
		display: flex;
		gap: 0.25rem;
	}

	// Выравнивание
	&--center #{$this}__list {
		justify-content: center;
	}

	&--end #{$this}__list {
		justify-content: flex-end;
	}

	&--stretch #{$this}__list {
		justify-content: space-between;
	}

	// Stretched - табы занимают всю ширину
	&--stretched {
		.s-tab-item {
			flex: 1;
			justify-content: center;
		}
	}

	// Внешний вид
	&--line {
		#{$this}__list {
			border-bottom: 1px solid #e5e7eb;
		}

		.s-tab-item {
			border-bottom: 2px solid transparent;

			&--active {
				border-bottom-color: #3b82f6;
			}
		}
	}

	&--pills {
		.s-tab-item {
			border-radius: 0.375rem;

			&--active {
				background: #eff6ff;
			}
		}
	}

	&--contained {
		#{$this}__list {
			background: #f9fafb;
			padding: 0.25rem;
			border-radius: 0.5rem;
		}

		.s-tab-item {
			border-radius: 0.375rem;

			&--active {
				background: white;
				box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
			}
		}
	}

	&--segmented {
		#{$this}__list {
			border: 1px solid #e5e7eb;
			border-radius: 0.5rem;
			padding: 0.25rem;
			gap: 0;
		}

		.s-tab-item {
			border-radius: 0.375rem;
			margin: 0;

			&--active {
				background: #3b82f6;
				color: white;
			}
		}
	}

	// Контент
	&__content {
		flex: 1;
		padding: 1rem;
	}

	// Отключенное состояние
	&:disabled,
	&--disabled {
		opacity: 0.5;
		pointer-events: none;
	}
}
</style>
