import { type TLoaderTypeIndicator } from '@/core'
import { provide, type InjectionKey } from 'vue'

export interface ILoaderHost {
	ctrl: TLoaderTypeIndicator
}

export const LOADER_KEY: InjectionKey<ILoaderHost> = Symbol('loader')

export function useProvideLoader(loader: ILoaderHost): void {
	provide(LOADER_KEY, loader)
}
