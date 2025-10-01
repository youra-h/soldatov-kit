import type { TObjectProps } from './types'

export abstract class TObject {
	getProps(): TObjectProps {
		return {}
	}

	setProps(props: Partial<TObjectProps>): void {
		Object.assign(this, props)
	}
}
