export type TConstructor<T = {}> = new (...args: any[]) => T

export type TAbstractConstructor<T = {}> = abstract new (...args: any[]) => T
