import { markRaw, defineAsyncComponent } from 'vue'

export function useIconImport(path: string) {
    return markRaw(defineAsyncComponent({
        loader: () => import(/* @vite-ignore */ path),
        onError(error) {
            console.error('Icon load error:', error)
        }
    }))
}
