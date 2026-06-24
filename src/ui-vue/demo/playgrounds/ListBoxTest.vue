<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { TListBox } from '@core'
import { ListBox, ListBoxItem } from '@ui/list-box'
import { Loader } from '@ui/loader'
import { Button } from '@ui/button'

// --- Данные ---

interface ICity {
	id: number
	text: string
	value: string
	selected?: boolean
}

const CITIES: ICity[] = [
	{ id: 1, text: 'Москва', value: 'moscow' },
	{ id: 2, text: 'Санкт-Петербург', value: 'spb' },
	{ id: 3, text: 'Новосибирск', value: 'novosibirsk' },
	{ id: 4, text: 'Екатеринбург', value: 'ekaterinburg' },
	{ id: 5, text: 'Казань', value: 'kazan' },
	{ id: 6, text: 'Нижний Новгород', value: 'nnovgorod' },
	{ id: 7, text: 'Челябинск', value: 'chelyabinsk' },
	{ id: 8, text: 'Самара', value: 'samara' },
	{ id: 9, text: 'Омск', value: 'omsk' },
	{ id: 10, text: 'Ростов-на-Дону', value: 'rostov' },
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

const citiesSource2 = ref<ICity[]>([])
const selected2 = ref<ICity[]>([])

function updateInstance2() {
	instance2.collection.clear()
	const q = filter2.value.toLowerCase()
	const source = q
		? citiesSource2.value.filter((c) => c.text.toLowerCase().includes(q))
		: citiesSource2.value
	source.forEach((c) => {
		instance2.collection.add({ text: c.text, value: c.value })
	})
}

instance2.events.on('change:selected', (items: any[]) => {
	selected2.value = items.map((item: any) => ({
		id: item.uid,
		text: item.text,
		value: item.value,
	}))
})

// --- Список 3: :items ---
const items3 = ref<Partial<any>[]>([])
const selected3 = ref<ICity[]>([])

function handleSelected3(items: any[]) {
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
	citiesSource2.value = []
	instance2.collection.clear()
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
		citiesSource2.value = data.map((c) => ({ ...c }))
		data.forEach((c) => {
			instance2.collection.add({ text: c.text, value: c.value })
		})

		// Список 3: items prop
		items3.value = data.map((c) => ({ text: c.text, value: c.value }))

		// Через 1 секунду — выбрать 2 случайных города
		setTimeout(() => {
			selectRandomTwo()
		}, 1000)

		isLoading.value = false
		isLoaded.value = true
	}, 1000)
}

function selectRandomTwo() {
	const shuffled = [...CITIES].sort(() => Math.random() - 0.5)
	const pick = shuffled.slice(0, 2)
	const pickValues = pick.map((c) => c.value)

	// Список 1: v-for — установим selected через данные
	cities1.value = cities1.value.map((c) => ({
		...c,
		selected: pickValues.includes(c.value),
	}))

	// Список 2: instance
	pickValues.forEach((v) => {
		const item = instance2.collection.findBy('value', v)
		if (item) item.selected = true
	})

	// Список 3: items — обновим selected на месте
	items3.value.forEach((item: any) => {
		item.selected = pickValues.includes(item.value)
	})
}
</script>

<template>
	<div class="list-box-test">
		<div class="list-box-test__header">
			<h2 class="list-box-test__title">ListBox — тест на реальных данных</h2>

			<Loader :visible="isLoading" variant="normal" size="normal" :indicator="true">
				<Button @click="loadData" :disabled="isLoading">
					{{ isLoading ? 'Загрузка...' : isLoaded ? 'Загрузить снова' : 'Load Data' }}
				</Button>
			</Loader>
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
						:selected="city.selected"
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

				<ListBox :ctrl="instance2" mode="multiple" :max-rows="6" />

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

				<ListBox
					mode="multiple"
					:items="items3"
					:max-rows="6"
					@change:selected="handleSelected3"
				/>

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
