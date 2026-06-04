import { TStateUnit } from '../../../common/state-unit'

/**
 * Единица состояния closable для элемента таба.
 *
 * Хранит собственное значение (boolean | undefined).
 * Через setParentResolver получает ссылку на родительский TTabs.closable,
 * что позволяет разрешить итоговое значение без циклической зависимости.
 *
 * Логика resolved: item.closable ?? container.closable ?? false
 */
export class TTabClosableState extends TStateUnit<boolean | undefined> {
	private _parentResolver: (() => boolean) | undefined

	constructor(initial?: boolean) {
		super(initial)
	}

	/** Инжектируется из TTabs при добавлении таба в коллекцию */
	setParentResolver(resolver: () => boolean): void {
		this._parentResolver = resolver
	}

	/** Итоговое значение: собственное ?? родительское ?? false */
	get resolved(): boolean {
		return this._value ?? this._parentResolver?.() ?? false
	}
}
