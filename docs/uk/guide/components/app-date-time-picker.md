<script setup>
import {ref} from 'vue';

const timezoneModel = ref(new Date())

</script>

# DatetimePicker

<code>DatetimePicker</code> компонент для вводу дати та часу

## Звичайний вибір дати

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

## Вибір дати та часу

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

## Вибір діапазону дат

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

## Режими <Badge type="tip" text="^0.1.0" />

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

## Ярлики для швидкого доступу

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

## Час за замовчуванням

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

## Формати

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

## Заблокована дата

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
      <td>date-format</td>
      <td>
        призначений для відображення дати в інпуті у певному форматі.
        <a href="#формати">більше</a>
      </td>
      <td>
        <code>string</code>
      </td>
      <td>yyyy/MM/dd</td>
    </tr>
    <tr>
      <td>time-format</td>
      <td>
        призначений для відображення дати в інпуті у певному форматі, який знаходиться в поповері при режимах
        <code>datetime</code>, <code>datetimerange</code>)
        <a href="#формати">більше</a>
      </td>
      <td>
        <code>string</code>
      </td>
      <td>HH:mm:ss</td>
    </tr>
    <tr>
      <td>combine-formats</td>
      <td>
        згенерувати формат для пікера на основі пропсів <code>date-format</code> &
        <code>time-format</code>
      </td>
      <td>
        <code>boolean</code>
      </td>
      <td>true</td>
    </tr>
    <tr>
      <td>type</td>
      <td>який тип пікера слід відображати</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>string</code></div>
          <Info>
            <code>date | datetime | daterange | datetimerange</code>
          </Info>
        </div>
      </td>
      <td><code>date</code></td>
    </tr>
    <tr>
      <td>
        <div class="vi-table__cell--flex">
          <span>mode</span>
          <Badge type="tip" text="^0.1.0" />
        </div>
      </td>
      <td>в якому режимі ви хочете відображати календар. <a href="#режими">більше</a></td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>string</code></div>
          <Info>
            <code>day | month | year</code>
          </Info>
        </div>
      </td>
      <td><code>day</code></td>
    </tr>
    <tr>
      <td>first-day-of-week</td>
      <td>
        порядок днів тижня в денному календарі
      </td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>number</code></div>
          <Info>
            <code>1 | 2 | 3 | 4 | 5 | 6 | 7</code>
          </Info>
        </div>
      </td>
      <td>1</td>
    </tr>
    <tr>
      <td>weekday-format</td>
      <td>
        формат днів тижня в денному календарі
      </td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>string</code></div>
          <Info>
            <code>long | short | narrow</code>
          </Info>
        </div>
      </td>
      <td><code>short</code></td>
    </tr>
    <tr>
      <td>month-cell-format</td>
      <td>
        формат місяців у календарі
      </td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>string</code></div>
          <Info>
            <code>long | short | narrow | numeric | 2-digit</code>
          </Info>
        </div>
      </td>
      <td><code>short</code></td>
    </tr>
    <tr>
      <td>month-button-format</td>
      <td>
        формат місяця в кнопці яка знаходиться у верхній панелі календаря
      </td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>string</code></div>
          <Info>
            <code>long | short | narrow | numeric | 2-digit</code>
          </Info>
        </div>
      </td>
      <td><code>long</code></td>
    </tr>
    <tr>
      <td>shortcuts</td>
      <td>
        список ярликів для швидкого вибору дати.
        <a href="#ярлики-для-швидкого-доступу">більше</a>
      </td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>object</code></div>
          <Info>
            <code>
              Array<{ "text": string; "value": Date | null | (Date | null)[] }>
            </code>
          </Info>
        </div>
      </td>
      <td>[]</td>
    </tr>
    <tr>
      <td>default-time</td>
      <td>
        час, який буде встановлено за замовчуванням. Очікуваний формат - «00:00:00».
        <a href="#час-за-замовчуванням">більше</a>
      </td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>string</code> / <code>object</code></div>
          <Info>
            <code>string[]</code>
          </Info>
        </div>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>locale</td>
      <td>
        мова, якою ви хочете відображати дані в пікері
        (Використовуйте тільки якщо у вас немає пакета <code>vue-i18n</code>)
      </td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>string</code></div>
          <Info>
            <code>Intl.LocalesArgument</code>
          </Info>
        </div>
      </td>
      <td>en</td>
    </tr>
    <tr>
      <td>time-options</td>
      <td>налаштування пікера часу</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>string</code></div>
          <Info>
            <code
              >{placeholder?: string; startPlaceholder?: string;
              endPlaceholder?: string}</code
            >
          </Info>
        </div>
      </td>
      <td>{}</td>
    </tr>
    <tr>
      <td>disabled-date</td>
      <td>визначення заблокованих дат</td>
      <td>
        <div class="vi-table__cell--flex">
          <div><code>Function</code></div>
          <Info>
            <code>(date: Date) => boolean</code>
          </Info>
        </div>
      </td>
      <td>—</td>
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
        текст, який буде відображено в інпуті коли пікер тип пікера відповідає одному з цих значеннь: (<code>date</code>, <code>datetime</code>)
      </td>
      <td>
        <code>string</code>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>start-placeholder</td>
      <td>
        текст, який буде відображено в першому інпуті коли пікер тип пікера відповідає одному з цих значеннь: (<code>daterage</code>,
        <code>datetimerange</code>)
      </td>
      <td>
        <code>string</code>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>end-placeholder</td>
      <td>
        текст, який буде відображено в останньому інпуті коли пікер тип пікера відповідає одному з цих значеннь: (<code>daterage</code>,
        <code>datetimerange</code>)
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
            <a href></a>
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
