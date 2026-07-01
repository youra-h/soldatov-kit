<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { TListBox } from '@core'
import { ListBox, ListBoxItem } from '@ui/list-box'
import { Button } from '@ui/button'

// --- Данные ---

interface ICity {
	id: number
	text: string
	value: string
	_?: {
		selected?: boolean
	}
}

const CITIES: ICity[] = [
	{ id: 1, text: 'Москва Москва Москва Москва Москва Москва Москва Москва', value: 'moscow' },
	{ id: 2, text: 'Санкт-Петербург', value: 'spb' },
	{ id: 3, text: 'Новосибирск', value: 'novosibirsk' },
	{ id: 4, text: 'Екатеринбург', value: 'ekaterinburg' },
	{ id: 5, text: 'Казань', value: 'kazan' },
	{ id: 6, text: 'Нижний Новгород', value: 'nnovgorod' },
	{ id: 7, text: 'Челябинск', value: 'chelyabinsk' },
	{ id: 8, text: 'Самара', value: 'samara' },
	{ id: 9, text: 'Омск', value: 'omsk' },
	{ id: 10, text: 'Ростов-на-Дону', value: 'rostov' },
	{ id: 11, text: 'Уфа', value: 'ufa' },
	{ id: 12, text: 'Красноярск', value: 'krasnoyarsk' },
	{ id: 13, text: 'Воронеж', value: 'voronezh' },
	{ id: 14, text: 'Пермь', value: 'perm' },
	{ id: 15, text: 'Волгоград', value: 'volgograd' },
	{ id: 16, text: 'Краснодар', value: 'krasnodar' },
	{ id: 17, text: 'Саратов', value: 'saratov' },
	{ id: 18, text: 'Тюмень', value: 'tyumen' },
	{ id: 19, text: 'Тольятти', value: 'tolyatti' },
	{ id: 20, text: 'Ижевск', value: 'izhevsk' },
	{ id: 21, text: 'Барнаул', value: 'barnaul' },
	{ id: 22, text: 'Ульяновск', value: 'ulyanovsk' },
	{ id: 23, text: 'Иркутск', value: 'irkutsk' },
	{ id: 24, text: 'Хабаровск', value: 'khabarovsk' },
	{ id: 25, text: 'Ярославль', value: 'yaroslavl' },
]

// --- Состояние ---

const isLoading = ref(false)
const isLoaded = ref(false)

// Фильтры для каждого списка
const filter1 = ref('')
const filter2 = ref('')
const filter3 = ref('')

// --- Список 1: <list-box-item v-for> ---
const cities1 = ref<ICity[]>([])

const filteredCities1 = computed(() => {
	const q = filter1.value.toLowerCase()
	if (!q) return cities1.value
	return cities1.value.filter((c) => c.text.toLowerCase().includes(q))
})

const selected1 = ref<ICity[]>([])

function handleSelected1(items: any[]) {
	selected1.value = items.map((item: any) => ({
		id: item.uid,
		text: item.text,
		value: item.value,
	}))
}

// --- Список 2: :instance ---
const instance2 = new TListBox({ maxRows: 6, mode: 'multiple' })

const selected2 = ref<ICity[]>([])

function updateInstance2() {
	const q = filter2.value.toLowerCase()

	// for (const item of instance2.collection) {
	// 	item.visible = q ? item.text.toLowerCase().includes(q) : true
	// }

	for (const item of instance2.collection) {
		item.rendered = q ? item.text.toLowerCase().includes(q) : true
	}
}

instance2.events.on('change:selected', (items: any[]) => {
	selected2.value = items.map((item: any) => ({
		id: item.uid,
		text: item.text,
		value: item.value,
	}))
})

function moveItems() {
	instance2.collection.move(0, 10)
	// instance2.collection.move(2, 0)
}

// --- Список 3: :items ---
const items3 = ref<Partial<any>[]>([])
const selected3 = ref<ICity[]>([])

// Вариант 1: подмена массива через filter (новая ссылка → patchItems/setItems)
// Сохраняет выделение через _: { selected } в мета-данных
// Реагирует только на изменения данных (items3, filter3), не на selected3,
// чтобы не создавать цикл: selected → patchItems → change:selected → ...
const filteredItems3 = ref<Partial<any>[]>([])

watch(
	[items3, filter3],
	() => {
		const q = filter3.value.toLowerCase()
		const selectedValues = new Set(selected3.value.map((s) => s.value))

		const result = q
			? items3.value.filter((item: any) => item.text.toLowerCase().includes(q))
			: items3.value

		if (selectedValues.size === 0) {
			filteredItems3.value = result
			return
		}

		filteredItems3.value = result.map((item: any) => {
			if (selectedValues.has(item.value)) {
				return { ...item, _: { selected: true } }
			}
			return item
		})
	},
	{ immediate: true },
)

// const filteredItems3 = computed(() => {
// 	const q = filter3.value.toLowerCase()
// 	if (!q) return items3.value
// 	return items3.value.filter((item: any) => item.text.toLowerCase().includes(q))
// })

// Вариант 2: мутации исходного массива (та же ссылка)
// Требует хранения полного списка отдельно
// const allItems3 = ref<Partial<any>[]>([])
// watch(
// 	filter3,
// 	(q) => {
// 		const lower = q.toLowerCase()
// 		// Удаляем неподходящие
// 		for (let i = items3.value.length - 1; i >= 0; i--) {
// 			const item = items3.value[i] as any
// 			if (!item.text.toLowerCase().includes(lower)) {
// 				items3.value.splice(i, 1)
// 			}
// 		}
// 		// Добавляем подходящие из полного списка
// 		allItems3.value.forEach((item: any) => {
// 			if (item.text.toLowerCase().includes(lower)) {
// 				if (!items3.value.find((i: any) => i.value === item.value)) {
// 					items3.value.push(item)
// 				}
// 			}
// 		})
// 	},
// 	{ immediate: true },
// )

// // Для Варианта 2 computed просто возвращает items3 (ссылка не меняется)
// const filteredItems3 = computed(() => items3.value)

function handleSelected3(items: any[]) {
	console.log('handleSelected3', items)
	selected3.value = items.map((item: any) => ({
		id: item.uid,
		text: item.text,
		value: item.value,
	}))
}

// --- Загрузка данных ---

function loadData() {
	if (isLoading.value) return

	isLoading.value = true
	isLoaded.value = false

	// Сброс
	cities1.value = []
	instance2.collection.reset()
	items3.value = []
	selected1.value = []
	selected2.value = []
	selected3.value = []
	filter1.value = ''
	filter2.value = ''
	filter3.value = ''

	setTimeout(() => {
		// Загрузка во все три списка
		const data: ICity[] = CITIES.map((c) => ({ ...c }))

		// Список 1: v-for
		cities1.value = data

		// Список 2: instance
		instance2.collection.setItems(data.map((c) => ({ text: c.text, value: c.value })))

		// setTimeout(() => {
		// 	console.log('Выбираем 9-й элемент в списке 2 (instance)...')
		// 	// instance2.collection.getItem(5)?.select()
		// 	instance2.collection.getItem(15)?.select()
		// 	// instance2.collection.getItem(8)?.select()
		// }, 2000)

		// Список 3: items prop
		items3.value = data.map((c) => ({ text: c.text, value: c.value }))
		// allItems3.value = data.map((c) => ({ text: c.text, value: c.value }))

		isLoading.value = false
		isLoaded.value = true
	}, 1000)
}
</script>

<template>
	<div class="list-box-test">
		<div class="list-box-test__header">
			<h2 class="list-box-test__title">ListBox — тест на реальных данных</h2>

			<Button @click="loadData" :disabled="isLoading">
				{{ isLoading ? 'Загрузка...' : isLoaded ? 'Загрузить снова' : 'Load Data' }}
			</Button>
		</div>

		<div v-if="isLoaded" class="list-box-test__timeline">
			⏱️ 0s — загрузка | 2s — push | 3s — splice | 4s — slice (новая ссылка)
		</div>

		<div v-if="isLoaded" class="list-box-test__grid">
			<!-- Список 1: v-for -->
			<div class="list-box-test__column">
				<h3 class="list-box-test__column-title">v-for</h3>

				<input
					v-model="filter1"
					class="list-box-test__filter"
					type="text"
					placeholder="Фильтр..."
				/>

				<ListBox mode="multiple" :max-rows="6" @change:selected="handleSelected1">
					<ListBoxItem
						v-for="city in filteredCities1"
						:key="city.id"
						:text="city.text"
						:value="city.value"
						:selected="city._?.selected"
					/>
				</ListBox>

				<div class="list-box-test__selected">
					<strong>Выбрано:</strong>
					<span v-if="selected1.length === 0" class="list-box-test__empty">нет</span>
					<span v-else>{{ selected1.map((s) => s.text).join(', ') }}</span>
				</div>
			</div>

			<!-- Список 2: instance -->
			<div class="list-box-test__column">
				<h3 class="list-box-test__column-title">Instance</h3>

				<input
					v-model="filter2"
					class="list-box-test__filter"
					type="text"
					placeholder="Фильтр..."
					@input="updateInstance2"
				/>

				<ListBox :ctrl="instance2" mode="multiple" :max-rows="6" :word-wrap="true" />

				<div class="flex gap-2">
					<Button @click="moveItems">move(0↔9)</Button>
				</div>

				<div class="list-box-test__selected">
					<strong>Выбрано:</strong>
					<span v-if="selected2.length === 0" class="list-box-test__empty">нет</span>
					<span v-else>{{ selected2.map((s) => s.text).join(', ') }}</span>
				</div>
			</div>

			<!-- Список 3: items prop -->
			<div class="list-box-test__column">
				<h3 class="list-box-test__column-title">Items prop</h3>

				<input
					v-model="filter3"
					class="list-box-test__filter"
					type="text"
					placeholder="Фильтр..."
				/>

				<!-- <ListBox
					mode="multiple"
					:items="filteredItems3"
					:track-by="(item) => item.value"
					:max-rows="6"
					@change:selected="handleSelected3"
				/> -->

				<div class="list-box-test__selected">
					<strong>Выбрано:</strong>
					<span v-if="selected3.length === 0" class="list-box-test__empty">нет</span>
					<span v-else>{{ selected3.map((s) => s.text).join(', ') }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.list-box-test {
	@apply p-6;
	@apply flex flex-col gap-6;

	&__header {
		@apply flex items-center justify-between;
	}

	&__title {
		@apply text-2xl font-bold;
	}

	&__timeline {
		@apply text-sm text-gray-500 text-center py-2 px-4 bg-gray-100 rounded-md font-mono;
	}

	&__grid {
		@apply grid grid-cols-3 gap-6;
	}

	&__column {
		@apply flex flex-col gap-3;
	}

	&__column-title {
		@apply text-lg font-semibold text-gray-700;
	}

	&__filter {
		@apply w-full px-3 py-2;
		@apply border border-gray-300 rounded-md;
		@apply text-sm;
		@apply outline-none;
		@apply transition-colors;
		@apply focus:border-blue-500 focus:ring-1 focus:ring-blue-500;
	}

	&__selected {
		@apply text-sm text-gray-600;
		@apply p-2 bg-gray-50 rounded-md;
		@apply break-words;
	}

	&__empty {
		@apply text-gray-400 italic;
	}
}
</style>
