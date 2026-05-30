<script lang="ts">
import { TTabs, type ITabsProps, type ITabs } from '@core'
import BaseTabs, { syncTabs } from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
// items/activeItem are provided by syncTabs
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

		const { rendered, visible, classes, items, activeItem } = syncTabs({
			props,
			instance,
			plugins,
			emit,
		})

		return { instance, plugins, rootRef, rendered, visible, classes, activeItem, items }
	},
}
</script>

<template>
	<div ref="rootRef" v-if="rendered" v-show="visible" :class="classes">
		<div class="s-tabs__list" role="tablist">
			<div class="s-tabs__list--prefix" v-if="$slots.prefix">
				<slot name="prefix"></slot>
			</div>
			<slot>
				<TabItem v-for="item in items" :key="item.uid" :ctrl="item" />
			</slot>
			<div class="s-tabs__list--suffix" v-if="$slots.suffix">
				<slot name="suffix"></slot>
			</div>
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
		@apply flex-row gap-4;

		#{$this}__list {
			@apply flex-col;
		}

		#{$this}__panel {
			@apply my-0 flex-1;
		}

		&#{$this}--position-end {
			@apply flex-row-reverse;
		}
	}

	// Список табов
	&__list {
		@apply flex gap-4;

		&--prefix,
		&--suffix {
			@apply flex items-center;
			@apply px-1.5;
		}

		&--suffix {
			@apply ml-auto;
		}
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
		.s-tab-item {
			@apply flex-1 justify-center;
		}
	}

	// Внешний вид
	&--line {
		// Horizontal list: separator + indicator via ::after (uses --underline-pos and --underline-size)
		&#{$this}--horizontal {
			#{$this}__list {
				@apply relative border-b;

				&::after {
					content: '';
					@apply absolute left-0 h-0.5;
					@apply -bottom-px;
					@apply rounded-full;
					width: var(--underline-size, 0px);
					transform: translateX(var(--underline-pos, 0px));
				}
			}
		}

		/* Vertical orientation: indicator is a vertical bar beside the list (uses --underline-pos and --underline-size) */
		&#{$this}--vertical {
			#{$this}__list {
				@apply relative border-r;

				&::after {
					content: '';
					@apply absolute top-0 w-0.5;
					@apply -right-px;
					@apply rounded-full;
					height: var(--underline-size, 0px);
					transform: translateY(var(--underline-pos, 0px));
				}
			}

			/* If tabs positioned to the end, place border/indicator on the right */
			&#{$this}--position-end {
				#{$this}__list {
					@apply border-r-0 border-l;

					&::after {
						@apply -left-px;
					}
				}
			}
		}

		/* Transition включается только после монтирования (--ready добавляется core через el setter) */
		&#{$this}--ready-animation #{$this}__list::after {
			transition:
				transform 0.2s ease,
				width 0.2s ease;
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
		#{$this}__list {
			@apply p-1 gap-1.5;
			@apply rounded-md;
		}

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
			@apply relative gap-1.5;

			&::before,
			&::after {
				content: '';
				@apply absolute bottom-0 h-px;
			}

			// Левая часть бордера (до активного таба)
			&::before {
				left: 0;
				width: var(--gap-pos, 0px);
			}

			// Правая часть бордера (после активного таба)
			&::after {
				left: calc(var(--gap-pos, 0px) + var(--gap-size, 0px));
				right: 0;
			}
		}

		.s-tab-item {
			@apply relative border rounded-t-md rounded-b-none;
			@apply bg-transparent;
			@apply border-b-0;

			// Затемнение для неактивных табов
			&::before {
				content: '';
				@apply absolute inset-0;
				@apply pointer-events-none;
				@apply opacity-10;
				@apply bg-neutral-400;
				transition: opacity 0.2s ease;
			}

			&--active::before {
				@apply opacity-0;
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
