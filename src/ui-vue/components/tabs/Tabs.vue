<script lang="ts">
import { TTabs, type ITabsProps, type ITabs } from '@core'
import BaseTabs, { syncTabs } from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import { useCollectionItems } from '../../composables/useCollectionItems'
import { useEventRef } from '../../composables/useEventRef'
import { createTabsBundle } from '@plugins'
import { TabItem } from './tab-item'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_Tabs',
	extends: BaseTabs,
	components: { TabItem },
	setup(props: TBaseComponentViewProps<ITabsProps, ITabs>, { emit }) {
		const instance = useInstance(TTabs, props)
		// Инициализация плагинов
		const plugins = useBundle(createTabsBundle, props?.plugins)
		// Привязка инстанса к плагинам
		useInstanceBinding(plugins, instance)
		// Привязка элемента и инстанса к плагинам
		const rootRef = useElementBinding(plugins)

		syncTabs({
			props,
			instance,
			plugins,
			emit,
		})

		const items = useCollectionItems(instance.collection)

		const activeItem = useEventRef(
			instance.collection.events,
			() => instance.collection.activeItem ?? null,
			['item:activated', 'item:deactivated'],
		)

		return { instance, items, plugins, rootRef, activeItem }
	},
}
</script>

<template>
	<div
		ref="rootRef"
		v-if="instance.rendered"
		v-show="instance.visible"
		:class="instance.classes.list"
	>
		<div class="s-tabs__list" role="tablist">
			<slot>
				<TabItem v-for="item in items" :key="item.uid" :ctrl="item" />
			</slot>
		</div>
		<div v-if="activeItem && $slots[`panel:${activeItem?.value}`]" class="s-tabs__panel">
			<slot :name="`panel:${activeItem?.value}`" />
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
		&#{$this}--ready-animation #{$this}__list::after {
			transition:
				transform 0.2s ease,
				width 0.2s ease;
		}

		.s-tab-item {
			@apply -mb-px;
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

	&--contained {
		&#{$this}--normal {
			@include mixines.tabs-contained-variant('neutral');
		}

		&#{$this}--accent {
			@include mixines.tabs-contained-variant('accent');
		}

		&#{$this}--positive {
			@include mixines.tabs-contained-variant('positive');
		}

		&#{$this}--negative {
			@include mixines.tabs-contained-variant('negative');
		}

		&#{$this}--caution {
			@include mixines.tabs-contained-variant('caution');
		}
	}

	&--outline {
		// Структурные стили (не зависят от варианта)
		#{$this}__list {
			@apply border-b gap-1;
		}

		.s-tab-item {
			@apply border rounded-t-lg bg-s-neutral-100;

			&--active {
				@apply bg-white -mb-px border-b-white;
			}
		}

		// Цветовые варианты
		&#{$this}--normal {
			@include mixines.tabs-outline-variant('neutral');
		}

		&#{$this}--accent {
			@include mixines.tabs-outline-variant('accent');
		}

		&#{$this}--positive {
			@include mixines.tabs-outline-variant('positive');
		}

		&#{$this}--negative {
			@include mixines.tabs-outline-variant('negative');
		}

		&#{$this}--caution {
			@include mixines.tabs-outline-variant('caution');
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
