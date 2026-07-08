export type TComponentVariant = 'normal' | 'accent' | 'positive' | 'negative' | 'caution'

export type TComponentSize = 'sm' | 'normal' | 'lg' | 'xl' | '2xl'

export type TValuePayload<TValue> = {
	newValue: TValue
	oldValue: TValue
}

export type TScrollBehavior = 'none' | 'instant' | 'smooth'
