import { type TLoaderTypeIndicator } from '@/core'
import { provide, inject, type InjectionKey } from 'vue'

export interface ILoaderHost {
	ctrl: TLoaderTypeIndicator
}

export const LOADER_KEY: InjectionKey<ILoaderHost> = Symbol('loader')

export function useProvideLoader(loader: ILoaderHost): void {
	provide(LOADER_KEY, loader)
}

export function useInjectLoader(): ILoaderHost | null {
	return inject(LOADER_KEY, null)
}
