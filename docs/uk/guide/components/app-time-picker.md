<script setup>
import {ref} from 'vue';

const timezoneModel = ref(new Date())
const hourMinutesModel = ref(new Date())
const amPmModel = ref(new Date())

function setTime(hours, minutes, seconds){
  const now = new Date();

  now.setHours(hours)
  now.setMinutes(minutes)
  now.setSeconds(seconds)

  return now
} 

const defaultTime = setTime(15, 30, 30)

const defaultTimeRange = [setTime(12, 0, 30), setTime(17, 28, 30)]
</script>

# TimePicker

<code>TimePicker</code> компонент для введення часу

## Звичний вибір часу

Ви можете вибрати час за допомогою введеню даних в інпут або панелі вибору часу

<AppTimePicker placeholder="Виберіть час"/>

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker v-model="model" placeholder="Виберіть час" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppTimePicker v-model="model" placeholder="Виберіть час" />
</template>

<script>
export default {
  data() {
    return {
      model: null,
    };
  },
};
</script>
```

:::

## Вибір часового діапазону

За допомогою атрибута <code>is-range</code> пікер почне працювати в режимі вибору часового діапазону

::: tip ПІДКАЗКА
Зверніть увагу, що якщо ви не використовуєте атрибут <code>selectable-range</code> і якщо встановлено атрибут <code>is-range="true"</code>, пікер автоматично визначить допустимий діапазон на основі вибраних даних.
:::

<AppTimePicker is-range start-placeholder="Початковий час" end-placeholder="Кінцевий час"/>

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker
    v-model="model"
    is-range
    start-placeholder="Початковий час"
    end-placeholder="Кінцевий час"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppTimePicker
    v-model="model"
    is-range
    start-placeholder="Початковий час"
    end-placeholder="Кінцевий час"
  />
</template>

<script>
export default {
  data() {
    return {
      model: null,
    };
  },
};
</script>
```

:::

## Час за замовчуванням

У пікері ви можете встановити час, який буде підставлятися за замовчуванням, коли користувач відкриває його вперше.
Ви можете налаштувати як для одного пікера, так і для кожного пікера окремо.

<AppTimePicker :default-time="defaultTime" placeholder="Виберіть час"/>

<br>

<AppTimePicker is-range :default-time="defaultTimeRange" start-placeholder="Початковий час" end-placeholder="Кінцевий час"/>

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker
    v-model="modelFirst"
    :default-time="defaultTime"
    placeholder="Виберіть час"
  />

  <AppTimePicker
    v-model="modelLast"
    is-range
    :default-time="defaultTimeRange"
    start-placeholder="Початковий час"
    end-placeholder="Кінцевий час"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const modelFirst = ref(null);
const modelLast = ref(null);

const defaultTime = setTime(15, 30, 30);

const defaultTimeRange = [setTime(12, 0, 30), setTime(17, 28, 30)];

function setTime(hours: number, minutes: number, seconds: number): Date {
  const now = new Date();

  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(seconds);

  return now;
}
</script>
```

```vue [Options API]
<template>
  <AppTimePicker
    v-model="modelFirst"
    :default-time="defaultTime"
    placeholder="Виберіть час"
  />

  <AppTimePicker
    v-model="modelLast"
    is-range
    :default-time="defaultTimeRange"
    start-placeholder="Початковий час"
    end-placeholder="Кінцевий час"
  />
</template>

<script>
export default {
  data() {
    return {
      modelFirst: null,
      modelLast: null,
    };
  },
  computed: {
    defaultTime() {
      return setTime(15, 30, 30);
    },
    defaultTimeRange() {
      return [setTime(12, 0, 30), setTime(17, 28, 30)];
    },
  },
  methods: {
    setTime(hours, minutes, seconds) {
      const now = new Date();

      now.setHours(hours);
      now.setMinutes(minutes);
      now.setSeconds(seconds);

      return now;
    },
  },
};
</script>
```

:::

## Часовий пояс

<p>Атрибут <code>timezone</code> використовується для корекції часу в пікері</p>

::: warning ПОПЕРЕДЖЕННЯ
Об'єкт <code>Date</code> завжди залишається в локальному часовому поясі
:::

Коли вибрано дату, компонент атоматично обчислює різницю між локальним часовим поясом користувача і часовим поясом, зазначеним у timezone, і додає або віднімає її від часу вибраної дати для остаточного відображення.

Те ж саме відбувається, коли користувач вперше вибирає дату, тільки в цьому випадку дата повертається, приведена до місцевого часу користувача

::: info ІНФОРМАЦІЯ

<p>Обраний часовий пояс: <code>America/New_York</code></p>
<p>Ваш місцевий час: <code>{{ timezoneModel }}</code></p>
:::

<AppTimePicker v-model="timezoneModel" timezone="America/New_York"/>

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker v-model="model" timezone="America/New_York" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppTimePicker v-model="model" timezone="America/New_York" />
</template>

<script>
export default {
  data() {
    return {
      model: new Date(),
    };
  },
};
</script>
```

:::

## Формати

Ви можете налаштувати формат, в якому буде відображатися дата в інпуті.
Також, на відміну від <code>DateTimePicker</code>, формат впливає на відображення панелей у поповері.

::: tip ПІДКАЗКА
Щоб дізнатися більше про доступні формати, перейдіть за цим [посиланням](../formats)
:::

<p>Відображення тільки годин і хвилин:</p>

<AppTimePicker v-model="hourMinutesModel" format="HH:mm" placeholder="HH:mm"/>

<p>Відображення часу з AM\PM:</p>

<AppTimePicker v-model="amPmModel" format="hh:mm:ss a" placeholder="HH:mm"/>

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker v-model="modelFirst" format="HH:mm" placeholder="HH:mm" />

  <AppTimePicker v-model="modelLast" format="hh:mm:ss a" placeholder="HH:mm" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const modelFirst = ref(null);
const modelLast = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppTimePicker v-model="modelFirst" format="HH:mm" placeholder="HH:mm" />

  <AppTimePicker v-model="modelLast" format="hh:mm:ss a" placeholder="HH:mm" />
</template>

<script>
export default {
  data() {
    return {
      modelFirst: null,
      modelLast: null,
    };
  },
};
</script>
```

:::

## Обмеження часового діапазону

За допомогою атрибута <code>selectable-range</code> ви можете обмежити вибір часу для користувача.
Цей атрибут працює для пікера у звичайному режимі та при виборі діапазону.

::: warning ПОПЕРЕДЖЕННЯ
Атрибут має строгий формат, а саме <code>'HH:mm:ss - HH:mm:ss'</code>, а для режиму вибору діапазону <code>[‘HH:mm:ss - HH:mm:ss’, ‘HH:mm:ss - HH:mm:ss’]</code>.
:::

::: info ІНФОРМАЦІЯ
Якщо пікер не має початкового значення і налаштовано атрибут <code>selectable-range</code>, то час, який буде вибрано за замовчуванням (поточний час або час, який було передано в атрибуті <code>default-time</code>), буде визначено відносно атрибуту <code>selectable-range</code>.

- Якщо поточний час менший за початковий, буде обрано початковий час
- Якщо поточний час більший за кінцевий час, буде обрано кінцевий час
- Якщо поточний час знаходиться в діапазоні, тоді буде обрано його

:::

<br>

<AppTimePicker selectable-range="12:30:30 - 16:00:00" placeholder="Виберіть час"/>

<br>

<AppTimePicker is-range :selectable-range="['12:30:30 - 16:00:00', '12:00:30 - 14:30:00']" start-placeholder="Початковий час" end-placeholder="Кінцевий час" />

<br>

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker
    v-model="modelFirst"
    selectable-range="12:30:30 - 16:00:00"
    placeholder="Виберіть час"
  />

  <AppTimePicker
    v-model="modelLast"
    is-range
    :selectable-range="['12:30:30 - 16:00:00', '12:00:30 - 14:30:00']"
    start-placeholder="Початковий час"
    end-placeholder="Кінцевий час"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const modelFirst = ref(null);
const modelLast = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppTimePicker
    v-model="modelFirst"
    selectable-range="12:30:30 - 16:00:00"
    placeholder="Виберіть час"
  />

  <AppTimePicker
    v-model="modelLast"
    is-range
    :selectable-range="['12:30:30 - 16:00:00', '12:00:30 - 14:30:00']"
    start-placeholder="Початковий час"
    end-placeholder="Кінцевий час"
  />
</template>

<script>
export default {
  data() {
    return {
      modelFirst: null,
      modelLast: null,
    };
  },
};
</script>
```

:::

## API

### Атрибути

<table>
  <thead>
    <tr>
      <td>Назва</td>
      <td>Опис</td>
      <td>Тип</td>
      <td>За замовчуванням</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>v-model / model-value</td>
      <td>значення прив'язки, якщо це масив, то довжина повинна бути 2</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>null</code> / <code>Date</code> / <code>object</code></div>
          <Info>
            <code>[Date, Date] | [null, null]</code>
          </Info>
        </div>
      </td>
      <td>null</td>
    </tr>
    <tr>
      <td>is-range</td>
      <td>чи відображати пікер у режимі вибору часового діапазону</td>
      <td>
        <code>boolean</code> 
      </td>
      <td>false</td>
    </tr>
    <tr>
      <td>time-format</td>
      <td>
        формат, в якому буде відображатися час у пікері, а також відповідні панелі у поповері
        <a href="#формати">більше</a>
      </td>
      <td>
        <code>string</code>
      </td>
      <td>HH:mm:ss</td>
    </tr>
    <tr>
      <td>default-time</td>
      <td>
        час, який буде встановлено за замовчуванням
        <a href="#час-за-замовчуванням">більше</a>
      </td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>object</code></div>
          <Info>
            <code>Date | [Date, Date]</code>
          </Info>
        </div>
      </td>
      <td>new Date()</td>
    </tr>
    <tr>
      <td>selectable-range</td>
      <td>
        обмеження на вибір часу. Очікуваний формат <code>“HH:mm:ss - HH:mm:ss"</code> <br> <code>[“HH:mm:ss - HH:mm:ss",“HH:mm:ss - HH:mm:ss"]</code>.
        <a href="#обмеження-часового-діапазону">більше</a>
      </td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>string</code> / <code>object</code></div>
          <Info>
            <code>[string, string]</code>
          </Info>
        </div>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td>чи заблокований пікер</td>
      <td>
        <code>boolean</code>
      </td>
      <td>false</td>
    </tr>
    <tr>
      <td>readonly</td>
      <td>чи пікер доступний тільки для читання</td>
      <td>
        <code>boolean</code>
      </td>
      <td>false</td>
    </tr>
    <tr> 
      <td>
        <div class="vi-table__cell--flex">
          <span>input-readonly</span>
          <Badge type="tip" text="^0.0.2" />
        </div>
      </td>
      <td>перевести інпут в режим read-only, але через поповер є можливість обирати дату</td>
      <td>
        <code>boolean</code>
      </td>
      <td>false</td>
    </tr>
    <tr>
      <td>clearable</td>
      <td>відображення контролера для очищення входу даних, коли він переповнений</td>
      <td>
        <code>boolean</code>
      </td>
      <td>false</td>
    </tr>
    <tr>
      <td>timezone</td>
      <td>
        який часовий пояс буде використовуватися для корекції дати.
        <a href="#часовий-пояс">більше</a>
      </td>
      <td>
        <code>string</code>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td>
        текст, який буде відображатися в інпуті, коли пікер не перебуває в режимі вибору діапазону
      </td>
      <td>
        <code>string</code>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>start-placeholder</td>
      <td>
        текст, який буде відображено в першому інпуті, коли пікер перебуває в режимі вибору діапазону.
      </td>
      <td>
        <code>string</code>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>end-placeholder</td>
      <td>
        текст, який буде відображено в останньому інпуті, коли пікер перебуває в режимі вибору діапазону.
      </td>
      <td>
        <code>string</code>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>align</td>
      <td>положення поповера</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>string</code></div>
          <Info>
            <code>left | center | right</code>
          </Info>
        </div>
      </td>
      <td><code>left</code></td>
    </tr>
    <tr>
      <td>apply-text</td>
      <td>текст, що відображається в кнопці застосувати у поповері</td>
      <td>
        <code>string</code>
      </td>
      <td>"Apply"</td>
    </tr>
    <tr>
      <td>cancel-text</td>
      <td>текст, що відображається в кнопці скасування у поповері</td>
      <td>
        <code>string</code>
      </td>
      <td>"Cancel"</td>
    </tr>
    <tr>
      <td>invalid</td>
      <td>пікер має невірне значення</td>
      <td>
        <code>boolean</code>
      </td>
      <td>false</td>
    </tr>
    <tr>
      <td>open-delay</td>
      <td>
        затримка в мілісекундах перед відкриттям поповера
      </td>
      <td>
        <code>number</code>
      </td>
      <td>0</td>
    </tr>
    <tr>
      <td>close-delay</td>
      <td>
        затримка в мілісекундах перед закриттям поповера
      </td>
      <td>
        <code>number</code>
      </td>
      <td>150</td>
    </tr>
    <tr>
      <td>append-to-body</td>
      <td>
        визначає, чи слід додавати вміст спливаючого вікна до
        <code>body</code> замість того, щоб вкладати його в структуру DOM компонента.
      </td>
      <td>
        <code>boolean</code>
      </td>
      <td>true</td>
    </tr>
    <tr>
      <td>stay-opened</td>
      <td>
        залишайте пікап відкритим після відкриття. Використовуйте його для налагодження або
        дослідження поповера
      </td>
      <td>
        <code>boolean</code>
      </td>
      <td>false</td>
    </tr>
  </tbody>
</table>

### Події

<table>
  <thead>
    <tr>
      <td>Назва</td>
      <td>Опис</td>
      <td>Тип</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>change</td>
      <td>спрацьовує при зміні значення</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>Function</code></div>
          <Info>
            <code>(val: typeof v-model) => void</code>
          </Info>
        </div>
      </td>
    </tr>
    <tr>
      <td>focus</td>
      <td>спрацьовує, коли пікер знаходиться в фокусі</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>Function</code></div>
          <Info>
            <code>() => void</code>
          </Info>
        </div>
      </td>
    </tr>
    <tr>
      <td>blur</td>
      <td>спрацьовує, коли пікер перестає бути в фокусі</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>Function</code></div>
          <Info>
            <code>() => void</code>
          </Info>
        </div>
      </td>
    </tr>
  </tbody>
</table>

### Слоти

<table>
  <thead>
    <tr>
      <td>Назва</td>
      <td>Опис</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>default</td>
      <td>кастомне посилання для поповера</td>
    </tr>
    <tr>
      <td>separator</td>
      <td>кастомний вміст роздільника діапазону</td>
    </tr>
  </tbody>
</table>

#### Default слот <Badge type="tip" text="^0.0.2" />

Цей слот замінює поле введення дати. Нижче наведено таблицю з доступними пропсами для цього слоту

<table>
  <thead>
    <tr>
      <td>Назва</td>
      <td>Опис</td>
      <td>Тип</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td>Значення, яке передається в поле введення (без форматування)</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>null</code> / <code>Date</code> / <code>object</code></div>
          <Info>
            <code>[Date, Date] | [null, null]</code>
          </Info>
        </div>
      </td>
    </tr>
    <tr>
      <td>popoverVisible</td>
      <td>повертає, чи відкритий поповер в даний момент чи ні</td>
      <td>
        boolean
      </td>
    </tr>
    <tr>
      <td>input</td>
      <td>встановлення нового значення в пікері</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>Function</code></div>
          <Info>
            <code>(value: Date | null | (Date | null)[]) => void</code>
          </Info>
        </div>
      </td>
    </tr>
    <tr>
      <td>focus</td>
      <td>виконати фокус на пікер</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>Function</code></div>
          <Info>
            <code>() => void</code>
          </Info>
        </div>
      </td>
    </tr>
    <tr>
      <td>blur</td>
      <td>прибрати фокус з пікера</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>Function</code></div>
          <Info>
            <code>() => void</code>
          </Info>
        </div>
      </td>
    </tr>
  </tbody>
</table>

<br>

<TimeDefaultSlotExample  placeholder="Виберіть час"/>

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker v-model="model">
    <template #default="{ value, popoverVisible, input, focus }">
      <input
        :value="dateToStringTime(value)"
        :class="{ 'custom-input--focus': popoverVisible }"
        class="custom-input"
        placeholder="Виберіть час"
        @focus="focus"
        @input="event => stringDateToDate(event, input)"
      />
    </template>
  </AppTimePicker>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format, isDate, parse } from 'date-fns';

const model = ref(null);

const timeFormat = 'HH:ss:mm';

function dateToStringTime(value: Date | null) {
  if (!value || !isDate(value)) return '';

  return format(value, timeFormat);
}

function stringDateToDate(event: InputEvent, cb: (value: unknown) => void) {
  const value = (event.target as HTMLInputElement).value;

  const parsed = parse(value, timeFormat, new Date());

  if (!value) {
    cb(null);
  }

  if (value.length === timeFormat.length && isDate(parsed)) {
    cb(parsed);
  }
}
</script>

<style lang="scss" scoped>
.custom-input {
  width: 100%;
  border: 1px solid;

  &:focus,
  &--focus {
    border-color: blue;
  }
}
</style>
```

```vue [Options API]
<template>
  <AppTimePicker v-model="model">
    <template #default="{ value, popoverVisible, input, focus }">
      <input
        :value="dateToStringTime(value)"
        :class="{ 'custom-input--focus': popoverVisible }"
        class="custom-input"
        placeholder="Виберіть час"
        @focus="focus"
        @input="event => stringDateToDate(event, input)"
      />
    </template>
  </AppTimePicker>
</template>

<script>
export default {
  data() {
    return {
      model: null,
      timeFormat: 'HH:ss:mm',
    };
  },
  methods: {
    dateToStringTime(value) {
      if (!value || !isDate(value)) return '';

      return format(value, this.timeFormat);
    },

    stringDateToDate(event, cb) {
      const value = event.target.value;

      const parsed = parse(value, this.timeFormat, new Date());

      if (!value) {
        cb(null);
      }

      if (value.length === this.timeFormat.length && isDate(parsed)) {
        cb(parsed);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-input {
  width: 100%;
  border: 1px solid;

  &:focus,
  &--focus {
    border-color: blue;
  }
}
</style>
```

:::

### Доступні властивості компонента

<table>
  <thead>
    <tr>
      <td>Назва</td>
      <td>Опис</td>
      <td>Тип</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>popoverVisible</td>
      <td>повертає, чи відкрито спливаюче вікно в даний момент чи ні</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>object</code></div>
          <Info>
            <code>Ref< boolean ></code>
          </Info>
        </div>
      </td>
    </tr>
    <tr>
      <td>focus</td>
      <td>виконати фокус на пікер</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>Function</code></div>
          <Info>
            <code>() => void</code>
          </Info>
        </div>
      </td>
    </tr>
    <tr>
      <td>blur</td>
      <td>прибрати фокус з пікера</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>Function</code></div>
          <Info>
            <code>() => void</code>
          </Info>
        </div>
      </td>
    </tr>
  </tbody>
</table>
