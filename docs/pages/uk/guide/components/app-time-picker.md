<script setup>
import {ref} from 'vue';

const model = ref();

const rangeModel = ref();

const defaultTimeModel = ref();
const defaultTimeRangeModel = ref();

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

<DocsTitle text="TimePicker" link="timeticker"  />

<code>TimePicker</code> компонент для введення часу

<DocsTitle text="Звичний вибір часу" link="usualtimeselection" :level="2" />

Ви можете вибрати час за допомогою введеню даних в інпут або панелі вибору часу

<AppTimePicker v-model="model" placeholder="Виберіть час"/>

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

<DocsTitle text="Вибір часового діапазону" link="selectingatimerange" :level="2" />

За допомогою атрибута <code>is-range</code> пікер почне працювати в режимі вибору часового діапазону

::: tip ПІДКАЗКА
Зверніть увагу, що якщо ви не використовуєте атрибут <code>selectable-range</code> і якщо встановлено атрибут <code>is-range="true"</code>, пікер автоматично визначить допустимий діапазон на основі вибраних даних.
:::

<AppTimePicker v-model="rangeModel" is-range start-placeholder="Початковий час" end-placeholder="Кінцевий час"/>

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

<DocsTitle text="Час за замовчуванням" link="defaulttime" :level="2" />

У пікері ви можете встановити час, який буде підставлятися за замовчуванням, коли користувач відкриває його вперше.
Ви можете налаштувати як для одного пікера, так і для кожного пікера окремо.

<AppTimePicker v-model="defaultTimeModel" :default-time="defaultTime" placeholder="Виберіть час"/>

<br>

<AppTimePicker v-model="defaultTimeRangeModel" is-range :default-time="defaultTimeRange" start-placeholder="Початковий час" end-placeholder="Кінцевий час"/>

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

<DocsTitle text="Часовий пояс" link="timezone" :level="2" />

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

<DocsTitle text="Формати" link="formats" :level="2" />

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

<DocsTitle text="Обмеження часового діапазону" link="limitthetimerange" :level="2" />

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

<DocsTitle text="API" link="api" :level="2" />

<DocsTitle text="Атрибути" link="attributes" :level="3" />

<TimeTable  />

<DocsTitle text="Події" link="events" :level="3" />

<TimeTable type="event" />

<DocsTitle text="Слоти" link="slots" :level="3" />

<TimeTable type="slot" />

<DocsTitle text="Слоти" link="slots" :level="4" version="^0.0.2"/>

Цей слот замінює поле введення дати. Нижче наведено таблицю з доступними пропсами для цього слоту

<TimeTable type="default-slot" />

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

<DocsTitle text="Доступні властивості компонента" link="exposes" :level="3" />

<TimeTable type="expose" />
