# Color Usage Reference

Справочник по использованию цветов в компонентах UI-библиотеки.

Доступные палитры: `neutral`, `accent`, `positive`, `negative`, `caution`  
Доступные шейды: `50` · `100` · `200` · `300` · `400` · `500` · `600` · `700` · `800` · `900` · `950`

---

## Сводная таблица

| Цвет / шейд          | Button | CheckBox | Switch | Spinner |
|----------------------|:------:|:--------:|:------:|:-------:|
| `{color}-50`         |        | ✓ bg disabled | |    |
| `{color}-100`        | ✓ filled bg (neutral), plain hover bg | | ✓ bg track | ✓ border (3 стороны) |
| `{color}-200`        | ✓ filled hover bg (neutral), outlined border | | ✓ bg track (default) | ✓ border (3 стороны) |
| `{color}-300`        | ✓ filled active bg (neutral) | ✓ border hover | ✓ bg hover track |         |
| `{color}-400`        |        | ✓ border основной | |         |
| `{color}-500`        | ✓ filled bg (цветные) | | ✓ bg checked | |
| `{color}-600`        | ✓ filled bg (цветные, default) | ✓ svg fill | | ✓ border-left (active) |
| `{color}-700`        | ✓ filled hover bg (цветные), plain/outlined text | | ✓ bg hover track | |
| `{color}-800`        | ✓ filled active bg (цветные), plain/outlined text (neutral) | | |  |

> `{color}` — любая из палитр: `neutral`, `accent`, `positive`, `negative`, `caution`

---

## Button

Компонент управляется двумя prop-ами: `appearance` × `variant`.

### appearance="filled" (default)

| Состояние        | variant=normal (neutral) | variant=accent/positive/negative/caution |
|-----------------|--------------------------|------------------------------------------|
| default          | `neutral-100` bg         | `{color}-500` bg (default: 500), `text-white` |
| hover / focus    | `neutral-200` bg         | `{color}-600` bg                         |
| active           | `neutral-300` bg         | `{color}-700` bg                         |
| disabled         | `opacity-35`             | `opacity-35`                             |
| focus ring       | `--s-component-focus-ring` (`accent-400`) outline | ← то же |

### appearance="plain"

| Состояние     | variant=normal (neutral) | variant=accent/positive/negative/caution |
|--------------|--------------------------|------------------------------------------|
| default       | `neutral-800` text       | `{color}-800` text                       |
| hover / focus | `neutral-100` bg         | `{color}-100` bg                         |
| active        | `neutral-200` bg         | `{color}-200` bg                         |

### appearance="outlined"

| Состояние     | variant=normal (neutral) | variant=accent/positive/negative/caution |
|--------------|--------------------------|------------------------------------------|
| default       | `neutral-800` text, `neutral-400` border | `{color}-800` text, `{color}-400` border |
| hover / focus | `neutral-100` bg, `neutral-500` border   | `{color}-100` bg, `{color}-500` border   |
| active        | `neutral-200` bg         | `{color}-200` bg                         |

### appearance="none"

Прозрачный фон, без hover-эффектов. Только `text-s-component` и outline при focus.

---

## CheckBox

Компонент управляется prop-ом `variant`.

| Состояние              | variant=normal (neutral) | variant=accent/positive/negative/caution |
|-----------------------|--------------------------|------------------------------------------|
| border default         | `neutral-400`            | `{color}-400`                            |
| border hover           | `neutral-500`            | `{color}-500`                            |
| svg fill (checked icon)| `neutral-500`            | `{color}-500`                            |
| bg disabled            | `neutral-50`             | `{color}-50`                             |
| bg container (base)    | `white`                  | `white`                                  |
| focus ring             | `--s-component-focus-ring` (`accent-400`) outline | ← то же |

> Шейды вычисляются: `border-hover = border-main + 100`, `svg-fill = border-main + 100`  
> Дефолт: `border-main: 400`

---

## Switch

Компонент управляется prop-ом `variant`.

| Состояние                      | variant=normal (neutral) | variant=accent/positive/negative/caution |
|-------------------------------|--------------------------|------------------------------------------|
| bg track (unchecked)           | `neutral-200`            | `{color}-200`                            |
| bg track hover (unchecked)     | `neutral-300`            | `{color}-300`                            |
| bg track (checked)             | `neutral-500`            | `{color}-500`                            |
| bg thumb                       | `white`                  | `white`                                  |
| focus ring                     | `--s-component-focus-ring` (`accent-400`) outline | ← то же |
| disabled                       | `opacity-35` на track    | `opacity-35` на track                    |

> Шейды вычисляются: `bg-hover = bg + 100`  
> Дефолты: `bg-checked: 500`, `bg: 200`

---

## Spinner

Компонент управляется prop-ом `variant`. Представляет собой кольцо с одной выделенной стороной.

| Элемент                      | variant=normal (neutral) | variant=accent/positive/negative/caution |
|-----------------------------|--------------------------|------------------------------------------|
| border (top, right, bottom) — «фон» | `neutral-200`   | `{color}-200`                            |
| border-left — «активная» дуга | `neutral-600`          | `{color}-600`                            |

> Дефолты миксина: `border-idx: 200`, `border-idx-active: 600`

---

## Семантические токены

Определены в `foundation/theme/default.css` и `foundation/styles/utilities.css`.

| Токен CSS                   | Значение (light)       | Utility-класс         | Где используется                |
|-----------------------------|------------------------|-----------------------|---------------------------------|
| `--s-component-text`        | `neutral-800`          | `text-s-component`    | Button (base text)              |
| `--s-component-focus-ring`  | `accent-400`           | `outline-s-component` | Button, CheckBox, Switch (focus)|
| opacity disabled            | `0.35`                 | `opacity-s-component-disabled` | Button, CheckBox, Switch |
