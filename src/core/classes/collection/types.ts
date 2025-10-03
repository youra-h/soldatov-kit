import { TCollection } from './collections.class'

export type TCollectionEvents = {
	changed: (collection: TCollection) => void
	beforeChange: () => boolean
}
