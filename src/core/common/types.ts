export type TConstructor<T = {}> = new (...args: any[]) => T

export type TAbstractConstructor<T = {}> = abstract new (...args: any[]) => T

export type TComponentVariant = 'normal' | 'accent' | 'positive' | 'negative' | 'caution'

export type TComponentSize = 'sm' | 'normal' | 'lg' | 'xl' | '2xl'

export type TValuePayload<TValue> = {
	newValue: TValue
	oldValue: TValue
}

export type TScrollBehavior = 'none' | 'instant' | 'smooth'
