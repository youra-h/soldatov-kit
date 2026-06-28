<script lang="ts">
import { computed } from 'vue'
import { TSkeleton, type ISkeletonProps, type ISkeleton } from '@core'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import BaseSkeleton, { syncSkeleton } from './base.component'
import { createComponentViewBundle } from '@plugins'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_Skeleton',
	extends: BaseSkeleton,
	setup(props: TBaseComponentViewProps<ISkeletonProps, ISkeleton>, { emit }) {
		const instance = useInstance(TSkeleton, props)
		const plugins = useBundle(createComponentViewBundle, props?.plugins)

		useInstanceBinding(plugins, instance)
		const rootRef = useElementBinding(plugins)

		const { tag, rendered, visible, present, classes, variant, size, shape, animation, width, height } =
			syncSkeleton({
				props,
				instance,
				plugins,
				emit,
			})

		const placeholderStyles = computed(() => {
			const styles: Record<string, string> = {}
			const w = width.value
			const h = height.value
			if (w !== undefined && w !== null) {
				styles.width = typeof w === 'number' ? `${w}px` : String(w)
			}
			if (h !== undefined && h !== null) {
				styles.height = typeof h === 'number' ? `${h}px` : String(h)
			}
			return styles
		})

		return {
			instance,
			plugins,
			rootRef,
			tag,
			rendered,
			visible,
			present,
			classes,
			variant,
			size,
			shape,
			animation,
			placeholderStyles,
		}
	},
}
</script>

<template>
	<component ref="rootRef" :is="tag" v-if="rendered" :class="classes">
		<div
			v-if="present"
			class="s-skeleton__placeholder"
			:style="placeholderStyles"
		/>
		<slot v-else />
	</component>
</template>

<style lang="scss">
@use './mixins' as mixins;
@reference './../../../foundation/tailwind';

.s-skeleton {
	@apply block;

	&__placeholder {
		@apply w-full h-full;

		// shape
		.s-skeleton--rect & {
			@apply rounded-none;
		}

		.s-skeleton--rounded & {
			@apply rounded-md;
		}

		.s-skeleton--circle & {
			@apply rounded-full;
		}

		// animation
		.s-skeleton--pulse & {
			animation: skeleton-pulse 1.5s ease-in-out infinite;
		}

		.s-skeleton--wave & {
			@apply relative overflow-hidden;

			&::after {
				content: '';
				@apply absolute inset-0;
				background: linear-gradient(
					90deg,
					transparent 0%,
					rgba(255, 255, 255, 0.4) 50%,
					transparent 100%
				);
				animation: skeleton-wave 1.5s ease-in-out infinite;
			}
		}

		// variant colors
		.s-skeleton--normal & {
			@include mixins.skeleton-variant('neutral');
		}

		.s-skeleton--accent & {
			@include mixins.skeleton-variant('accent');
		}

		.s-skeleton--positive & {
			@include mixins.skeleton-variant('positive');
		}

		.s-skeleton--negative & {
			@include mixins.skeleton-variant('negative');
		}

		.s-skeleton--caution & {
			@include mixins.skeleton-variant('caution');
		}
	}
}

@keyframes skeleton-pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.4;
	}
}

@keyframes skeleton-wave {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(100%);
	}
}
</style>
