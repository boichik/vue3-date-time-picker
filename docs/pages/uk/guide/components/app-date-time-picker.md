<script setup>
import {ref} from 'vue';

const timezoneModel = ref(new Date())

</script>

<DocsTitle text="DatetimePicker"  />

<code>DatetimePicker</code> компонент для вводу дати та часу

<DocsTitle text="Звичайний вибір дати" link="usualdateselection" :leve="2"  />

Ви можете вибрати довільну дату (за замовчуванням пікер працює в режимі календаря з вибором дня місяця)

<BasicDateTimePicker placeholder="Виберіть дату"/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker v-model="model" placeholder="Виберіть дату" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppDateTimePicker v-model="model" placeholder="Виберіть дату" />
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

<DocsTitle text="Вибір дати та часу" link="selectingthedateandtime" :leve="2"  />

Передавши атрибут <code>type='datetime'</code>, ви переведете пікер в режим, коли можна вибрати дату і час

<BasicDateTimePicker type="datetime" placeholder="Виберіть дату"/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="model"
    type="datetime"
    placeholder="Виберіть дату"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppDateTimePicker
    v-model="model"
    type="datetime"
    placeholder="Виберіть дату"
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
<DocsTitle text="selectingadaterange" :level="2" />

При передачі атрибута <code>type=‘daterange’</code> або <code>type='datetimerange'</code> пікер перейде в режим вибору діапазону дат або дати і часу

<BasicDateTimePicker type="daterange" start-placeholder="Початкова дата" end-placeholder="Кінцева дата"/>

<br>

<BasicDateTimePicker type="datetimerange" start-placeholder="Початкова дата" end-placeholder="Кінцева дата"/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="dateRange"
    type="daterange"
    start-placeholder="Початкова дата"
    end-placeholder="Кінцева дата"
  />

  <AppDateTimePicker
    v-model="dateTimeRange"
    type="datetimerange"
    start-placeholder="Початкова дата"
    end-placeholder="Кінцева дата"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dateRange = ref(null);

const dateTimeRange = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppDateTimePicker
    v-model="dateRange"
    type="daterange"
    start-placeholder="Початкова дата"
    end-placeholder="Кінцева дата"
  />

  <AppDateTimePicker
    v-model="dateTimeRange"
    type="datetimerange"
    start-placeholder="Початкова дата"
    end-placeholder="Кінцева дата"
  />
</template>

<script>
export default {
  data() {
    return {
      dateRange: null,
      dateTimeRange: null,
    };
  },
};
</script>
```

:::
<DocsTitle text="Режими" link="modes" :level="2" version="^0.1.0"/>

Ви можете налаштувати потрібний вам режим календаря

- <code>day</code> - початкове відображення календаря: дні місяця (також можна вибрати місяць або рік)
- <code>month</code> - початкове відображення календаря: місяці року (також є можливість вибору року)
- <code>year</code> - початок відображення календаря: роки десятиліття

::: info ІНФОРМАЦІЯ
Зверніть увагу, що значення, яке буде передано назад, буде датою, а не числом

<p>
Щоб коректно відобразити значення у інпуті, передайте відповідний формат за допомогою атрибута <br> <code>date-format</code>
</p>
:::

<BasicDateTimePicker mode="month" date-format="MM" placeholder="Оберіть місяць"/>

<br>

<BasicDateTimePicker mode="year" date-format="yyyy" type="daterange" start-placeholder="Початковий рік" end-placeholder="Кінцевий рік"/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="month"
    mode="month"
    date-format="MM"
    placeholder="Оберіть місяць"
  />

  <AppDateTimePicker
    v-model="yearRange"
    date-format="yyyy"
    type="daterange"
    start-placeholder="Початковий рік"
    end-placeholder="Кінцевий рік"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const month = ref(null);

const yearRange = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppDateTimePicker
    v-model="month"
    mode="month"
    date-format="MM"
    placeholder="Оберіть місяць"
  />

  <AppDateTimePicker
    v-model="yearRange"
    date-format="yyyy"
    type="daterange"
    start-placeholder="Початковий рік"
    end-placeholder="Кінцевий рік"
  />
</template>

<script>
export default {
  data() {
    return {
      month: null,
      yearRange: null,
    };
  },
};
</script>
```

:::
<DocsTitle text="Ярлики для швидкого доступу" link="shortcuts" :level="2" />

Ви можете налаштувати ярлики для швидкого вибору дати

<ShortcutsDateTimePicker placeholder="Виберіть дату"/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="model"
    :shortcuts="shortcuts"
    placeholder="Виберіть дату"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);

const shortcuts = [
  {
    text: 'Сьогодні',
    value: new Date(),
  },
  {
    text: 'Наступний понеділок',
    value: (() => {
      const today = new Date();
      const nextMonday = new Date(
        today.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7))
      );
      return nextMonday;
    })(),
  },
  {
    text: 'Наступного тижня',
    value: new Date(new Date().setDate(new Date().getDate() + 7)),
  },
];
</script>
```

```vue [Options API]
<template>
  <AppDateTimePicker
    v-model="model"
    :shortcuts="shortcuts"
    placeholder="Виберіть дату"
  />
</template>

<script>
export default {
  data() {
    return {
      model: null,
    };
  },
  computed: {
    shortcuts: [
      {
        text: 'Сьогодні',
        value: new Date(),
      },
      {
        text: 'Наступний понеділок',
        value: (() => {
          const today = new Date();
          const nextMonday = new Date(
            today.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7))
          );
          return nextMonday;
        })(),
      },
      {
        text: 'Наступного тижня',
        value: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
    ],
  },
};
</script>
```

:::

<DocsTitle text="Час за замовчуванням" link="defaulttime" :level="2" />

Ви можете налаштувати, який час буде підставлятися за замовчуванням

<BasicDateTimePicker type="datetime" default-time="15:00:00" placeholder="Виберіть дату"/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="model"
    type="datetime"
    default-time="15:00:00"
    placeholder="Виберіть дату"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppDateTimePicker
    v-model="model"
    type="datetime"
    default-time="15:00:00"
    placeholder="Виберіть дату"
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

<TimezoneDateTimePicker v-model="timezoneModel"/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="model"
    type="datetime"
    timezone="America/New_York"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppDateTimePicker
    v-model="model"
    type="datetime"
    timezone="America/New_York"
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
<DocsTitle text="Формати" link="formats" :level="2" />

::: tip ПІДКАЗКА
Щоб дізнатися більше про доступні формати, перейдіть за цим [посиланням](../formats)
:::

<p>У цьому компоненті ви можете налаштувати формат дати, яка буде відображатися у вхідних даних.</p>

<code>date-format</code> атрибут відповідає за формат, який буде відображено в головному інпуті

<BasicDateTimePicker date-format="yyyy-MM-dd" placeholder="yyyy-MM-dd" />

<code>time-format</code> атрибут відповідає за формат, який буде відображатися при виборі часу у інпуті який знаходиться в поповері

<BasicDateTimePicker  type="datetime" date-format="yyyy-MM-dd" time-format="HH-mm-ss" placeholder="yyyy-MM-dd HH-mm-ss" />

Використання атрибуту <code>combine-formats</code> (за замовчуванням - <code>true</code>) можна визначити, чи потрібно поєднувати формат <code>date-format</code> & <code>time-format</code> для основного кроку (використовується, коли збирач працює в часовому типі)

Приклад, коли атрибут має негативне значення:
<BasicDateTimePicker  :combineFormats="false" type="datetime" date-format="yyyy-MM-dd" time-format="HH-mm-ss" placeholder="yyyy-MM-dd" />

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="model"
    type="datetime"
    date-format="yyyy-MM-dd"
    time-format="HH-mm-ss"
    placeholder="yyyy-MM-dd HH-mm-ss"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppDateTimePicker
    v-model="model"
    type="datetime"
    date-format="yyyy-MM-dd"
    time-format="HH-mm-ss"
    placeholder="yyyy-MM-dd HH-mm-ss"
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

<DocsTitle text="Заблокована дата" link="disableddate" :level="2" />

Для того, щоб заблокувати дату для вибору в пікері або при введенні, потрібно передати в атрибут <code>disabled-date</code> функцію, яка перевіряє, чи заблокована дата

<DisabledDateTimePicker placeholder="Виберіть дату" first-text="Блокувати дату, яка менша за поточну" last-text="Діапазон доступних дат (2 дні до і 2 дні після поточної дати)"/>

::: code-group

```vue [Composition API]
<template>
  <p>Блокувати дату, яка менша за поточну:</p>
  <AppDateTimePicker
    v-model="modelOne"
    :disabled-date="isDateDisabledBeforeToday"
    placeholder="Виберіть дату"
  />
  <p>Діапазон доступних дат (2 дні до і 2 дні після поточної дати):</p>
  <AppDateTimePicker
    v-model="modelTwo"
    :disabled-date="isDateNotInRange"
    placeholder="Виберіть дату"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const modelOne = ref(null);
const modelTwo = ref(null);

function isDateDisabledBeforeToday(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isDateNotInRange(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twoDaysBefore = new Date(today);
  twoDaysBefore.setDate(today.getDate() - 2);

  const twoDaysAfter = new Date(today);
  twoDaysAfter.setDate(today.getDate() + 2);

  return date <= twoDaysBefore || date >= twoDaysAfter;
}
</script>
```

```vue [Options API]
<template>
  <p>Блокувати дату, яка менша за поточну:</p>
  <AppDateTimePicker
    v-model="modelOne"
    :disabled-date="isDateDisabledBeforeToday"
    placeholder="Виберіть дату"
  />
  <p>Діапазон доступних дат (2 дні до і 2 дні після поточної дати):</p>
  <AppDateTimePicker
    v-model="modelTwo"
    :disabled-date="isDateNotInRange"
    placeholder="Виберіть дату"
  />
</template>

<script>
export default {
  data() {
    return {
      modelOne: null,
      modelTwo: null,
    };
  },
  methods: {
    isDateDisabledBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    isDateNotInRange(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const twoDaysBefore = new Date(today);
      twoDaysBefore.setDate(today.getDate() - 2);

      const twoDaysAfter = new Date(today);
      twoDaysAfter.setDate(today.getDate() + 2);

      return date <= twoDaysBefore || date >= twoDaysAfter;
    },
  },
};
</script>
```

:::
<DocsTitle text="API" link="api" :level="2" />
<DocsTitle text="Атрибути" link="attributes" :level="3" />

<DateTimeTable/>

<DocsTitle text="Події" link="events" :level="3" />

<DateTimeTable type="event"/>

<DocsTitle text="Слоти" link="slots" :level="3" />

<DateTimeTable type="slot"/>

<DocsTitle text="Default слот" link="defaultslot" :level="4" version="^0.0.2" />

Цей слот замінює поле введення дати. Нижче наведено таблицю з доступними пропсами для цього слоту

<DateTimeTable type="default-slot"/>

<br>

<DefaultSlotExample placeholder="Виберіть дату" />

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker v-model="model">
    <template #default="{ value, popoverVisible, input, focus }">
      <input
        :value="dateToStringDate(value)"
        :class="{ 'custom-input--focus': popoverVisible }"
        class="custom-input"
        placeholder="Виберіть дату"
        @focus="focus"
        @input="event => stringDateToDate(event, input)"
      />
    </template>
  </AppDateTimePicker>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format, isDate, parse } from 'date-fns';

const model = ref(null);

const dateFormat = 'yyyy-MM-dd';

function dateToStringDate(value: Date | null) {
  if (!value || !isDate(value)) return '';

  return format(value, dateFormat);
}

function stringDateToDate(event: InputEvent, cb: (value: unknown) => void) {
  const value = (event.target as HTMLInputElement).value;

  const parsed = parse(value, dateFormat, new Date());

  if (!value) {
    cb(null);
  }

  if (value.length === dateFormat.length && isDate(parsed)) {
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
  <AppDateTimePicker v-model="model">
    <template #default="{ value, popoverVisible, input, focus }">
      <input
        :value="dateToStringDate(value)"
        :class="{ 'custom-input--focus': popoverVisible }"
        class="custom-input"
        placeholder="Виберіть дату"
        @focus="focus"
        @input="event => stringDateToDate(event, input)"
      />
    </template>
  </AppDateTimePicker>
</template>

<script>
export default {
  data() {
    return {
      model: null,
      dateFormat: 'yyyy-MM-dd',
    };
  },
  methods: {
    dateToStringDate(value) {
      if (!value || !isDate(value)) return '';

      return format(value, this.dateFormat);
    },

    stringDateToDate(event, cb) {
      const value = event.target.value;

      const parsed = parse(value, this.dateFormat, new Date());

      if (!value) {
        cb(null);
      }

      if (value.length === this.dateFormat.length && isDate(parsed)) {
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

<DateTimeTable type="expose"/>
