<script setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n'

const timezoneModel = ref(new Date())

</script>

<DocsTitle text="DateTimePicker" />

<code>DateTimePicker</code> component for entering date and time

<DocsTitle text="Usual date selection" :level="2" />

You can choose an arbitrary date (By default, the picker works in calendar mode with a choice of the day of the month)

<BasicDateTimePicker placeholder="Select date" />

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker v-model="model" placeholder="Select date" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppDateTimePicker v-model="model" placeholder="Select date" />
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

<DocsTitle text="Selecting the date and time" :level="2" />

By passing the <code>type=‘datetime’</code> attribute, you will switch the picker to the mode when you can select the date and time

<BasicDateTimePicker type="datetime" placeholder="Select date"/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="model"
    type="datetime"
    placeholder="Select date"
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
    placeholder="Select date"
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

<DocsTitle text="Selecting a date range" :level="2" />

By passing the <code>type=‘daterange’</code> or <code>type=‘datetimerange’</code> attribute, the picker will switch to the mode of selecting a date range or date and time

<BasicDateTimePicker type="daterange" start-placeholder="Start date" end-placeholder="End date"/>

<br>

<BasicDateTimePicker type="datetimerange" start-placeholder="Start date" end-placeholder="End date"/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="dateRange"
    type="daterange"
    start-placeholder="Start date"
    end-placeholder="End date"
  />

  <AppDateTimePicker
    v-model="dateTimeRange"
    type="datetimerange"
    start-placeholder="Start date"
    end-placeholder="End date"
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
    start-placeholder="Start date"
    end-placeholder="End date"
  />

  <AppDateTimePicker
    v-model="dateTimeRange"
    type="datetimerange"
    start-placeholder="Start date"
    end-placeholder="End date"
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

<DocsTitle text="Modes" :level="2" version="^0.1.0"/>

You can configure the calendar mode you need

- <code>day</code> - the initial display of the calendar of days of the month (it is also possible to select a month or year)
- <code>month</code> - the initial display of the calendar of months of the year (it is also possible to select the year)
- <code>year</code> - start display of the calendar of years of the decade

::: info
Note that the value that will be emitted will be a date, not a number

<p>
To correctly display the value in the input, pass the appropriate format using the <br><code>date-format</code> attribute
</p>
:::

<BasicDateTimePicker mode="month" date-format="MM" placeholder="Select month"/>

<br>

<BasicDateTimePicker mode="year" date-format="yyyy" type="daterange" start-placeholder="Start year" end-placeholder="End year"/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="month"
    mode="month"
    date-format="MM"
    placeholder="Select month"
  />

  <AppDateTimePicker
    v-model="yearRange"
    date-format="yyyy"
    type="daterange"
    start-placeholder="Start year"
    end-placeholder="End year"
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
    placeholder="Select month"
  />

  <AppDateTimePicker
    v-model="yearRange"
    date-format="yyyy"
    type="daterange"
    start-placeholder="Start year"
    end-placeholder="End year"
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

<DocsTitle text="Shortcuts" :level="2" />

You can set up shortcuts to quickly select a date

<ShortcutsDateTimePicker/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="model"
    :shortcuts="shortcuts"
    placeholder="Select date"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);

const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Next Monday',
    value: (() => {
      const today = new Date();
      const nextMonday = new Date(
        today.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7))
      );
      return nextMonday;
    })(),
  },
  {
    text: 'A week later',
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
    placeholder="Select date"
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
        text: 'Today',
        value: new Date(),
      },
      {
        text: 'Next Monday',
        value: (() => {
          const today = new Date();
          const nextMonday = new Date(
            today.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7))
          );
          return nextMonday;
        })(),
      },
      {
        text: 'A week later',
        value: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
    ],
  },
};
</script>
```

:::

<DocsTitle text="Default time" :level="2" />

You can configure which time will be substituted by default

<BasicDateTimePicker type="datetime" default-time="15:00:00" placeholder="Select date"/>

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker
    v-model="model"
    type="datetime"
    default-time="15:00:00"
    placeholder="Select date"
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
    placeholder="Select date"
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

<DocsTitle text="Timezone" :level="2" />

<p>The <code>timezone</code> attribute is used to correct the time in the picker.</p>

::: warning
The <code>Date</code> object always remains in the local time zone
:::

When a date is selected, the component atomically calculates the difference between the user's local time zone and the time zone specified in timezone and adds or subtracts it from the time of the selected date for the final display.

The same thing happens when the user first selects a date, only in this case the date is returned, adjusted to the user's local time

::: info

<p>Selected Timezone: <code>America/New_York</code></p>
<p>Your local time: <code>{{ timezoneModel }}</code></p>
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

<DocsTitle text="Formats" :level="2" />

::: tip
To learn more about the available formats, follow this [link](../formats)
:::

<p>In this component, you can configure the format of the date that will be displayed in the inputs.</p>

<code>date-format</code> attribute is responsible for the format that will be displayed in the main input

<BasicDateTimePicker date-format="yyyy-MM-dd" placeholder="yyyy-MM-dd" />

<code>time-format</code> attribute is responsible for the format that will be displayed in the time selection in the popover

<BasicDateTimePicker  type="datetime" date-format="yyyy-MM-dd" time-format="HH-mm-ss" placeholder="yyyy-MM-dd HH-mm-ss" />

Using the <code>combine-formats</code> (default - <code>true</code>) attribute, you can determine whether it is necessary to combine the <code>date-format</code> & <code>time-format</code> format for the main instep (used when the picker works in the time type)

Example when the attribute has a value of false:
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

<DocsTitle text="Disabled date" :level="2" />

In order to block the date for selection in a picker or when entering into an input, you need to pass a function to the <code>disabledDate</code> attribute that checks whether the date is blocked

<DisabledDateTimePicker placeholder="Select date" first-text="Block a date that is less than the current one" last-text="Range of available dates (2 days before and 2 days after the current date)"/>

::: code-group

```vue [Composition API]
<template>
  <p>Block a date that is less than the current one:</p>
  <AppDateTimePicker
    v-model="modelOne"
    :disabled-date="isDateDisabledBeforeToday"
    placeholder="Select date"
  />
  <p>
    Range of available dates (2 days before and 2 days after the current date):
  </p>
  <AppDateTimePicker
    v-model="modelTwo"
    :disabled-date="isDateNotInRange"
    placeholder="Select date"
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
  <p>Block a date that is less than the current one:</p>
  <AppDateTimePicker
    v-model="modelOne"
    :disabled-date="isDateDisabledBeforeToday"
    placeholder="Select date"
  />
  <p>
    Range of available dates (2 days before and 2 days after the current date):
  </p>
  <AppDateTimePicker
    v-model="modelTwo"
    :disabled-date="isDateNotInRange"
    placeholder="Select date"
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

<DocsTitle text="API" :level="2" />
<DocsTitle text="Attributes" :level="3" />

<DateTimeTable/>

<DocsTitle text="Events" :level="3" />

<DateTimeTable type="event"/>

<DocsTitle text="Slots" :level="3" />

<DateTimeTable type="slot"/>

<DocsTitle text="Default slot" :level="4" version="^0.0.2" />

This slot is a replacement for the date entry field. Below is a table with the available props for this slot

<DateTimeTable type="default-slot"/>

<br>

<DefaultSlotExample />

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker v-model="model">
    <template #default="{ value, popoverVisible, input, focus }">
      <input
        :value="dateToStringDate(value)"
        :class="{ 'custom-input--focus': popoverVisible }"
        class="custom-input"
        placeholder="Select date"
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
        placeholder="Select date"
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

<DocsTitle text="Exposes" :level="3" />

<DateTimeTable type="expose"/>
