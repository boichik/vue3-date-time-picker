<script setup>
import {ref} from 'vue';

const timezoneModel = ref(new Date())

</script>

# DateTimePicker

<code>DateTimePicker</code> component for entering date and time

## Usual date selection

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

## Selecting the date and time

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

## Selecting a date range

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

## Shortcuts

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

## Default time

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

## Timezone

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

## Formats

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

## Disabled date

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

## API

### Attributes

<table>
  <thead>
    <tr>
      <td>Name</td>
      <td>Description</td>
      <td>Type</td>
      <td>Default</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>v-model / model-value</td>
      <td>binding value, if it is an array, the length should be 2</td>
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
        format is designed to display the date in the input data.
        <a href="#formats">more</a>
      </td>
      <td>
        <code>string</code>
      </td>
      <td>yyyy/MM/dd</td>
    </tr>
    <tr>
      <td>time-format</td>
      <td>
        format is for displaying the time in the time input (ie in
        <code>datetime</code>, <code>datetimerange</code> modes)
        <a href="#formats">more</a>
      </td>
      <td>
        <code>string</code>
      </td>
      <td>HH:mm:ss</td>
    </tr>
    <tr>
      <td>combine-formats</td>
      <td>
        generate the format for the picker from the <code>date-format</code> &
        <code>time-format</code> props
      </td>
      <td>
        <code>boolean</code>
      </td>
      <td>true</td>
    </tr>
    <tr>
      <td>type</td>
      <td>which type of picker should be displayed</td>
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
      <td>first-day-of-week</td>
      <td>
        the order of the days of the week in the day calendar
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
        format of the days of the week displayed in the calendar
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
        format of months displayed in the calendar
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
        the format of the month, which is displayed in the button located in the top panel of the calendar
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
        list of shortcuts to quickly select a date
        <a href="#shortcuts">more</a>
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
        the time that will be set by default. The expected format is “00:00:00”.
        <a href="#default-time">more</a>
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
        the language in which you want to display data in the picker. (Use only
        if you do not have the <code>vue-i18n</code> package)
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
      <td>setting up the time picker</td>
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
      <td>the option is used to define blocked dates</td>
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
      <td>whether the picker is blocked</td>
      <td>
        <code>boolean</code>
      </td>
      <td>false</td>
    </tr>
    <tr>
      <td>readonly</td>
      <td>whether the picker is read-only</td>
      <td>
        <code>boolean</code>
      </td>
      <td>false</td>
    </tr>
    <tr>
      <td>clearable</td>
      <td>displaying a controller for clearing a data input when it is full</td>
      <td>
        <code>boolean</code>
      </td>
      <td>false</td>
    </tr>
    <tr>
      <td>timezone</td>
      <td>
        which time zone will be used for date correction.
        <a href="#timezone">more</a>
      </td>
      <td>
        <code>string</code>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td>
        the text that will be displayed in the input when the picker type corresponds to one of these values: (<code>date</code>, <code>datetime</code>)
      </td>
      <td>
        <code>string</code>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>start-placeholder</td>
      <td>
        the text that will be displayed in the first input when the picker type corresponds to one of these values: (<code>daterage</code>,
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
        the text that will be displayed in the last input when the picker type corresponds to one of these values: (<code>daterage</code>,
        <code>datetimerange</code>)
      </td>
      <td>
        <code>string</code>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>align</td>
      <td>the position of the popover display</td>
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
      <td>the text displayed in the apply button in the picker popover</td>
      <td>
        <code>string</code>
      </td>
      <td>"Apply"</td>
    </tr>
    <tr>
      <td>cancel-text</td>
      <td>the text displayed in the cancel button in the picker popover</td>
      <td>
        <code>string</code>
      </td>
      <td>"Cancel"</td>
    </tr>
    <tr>
      <td>invalid</td>
      <td>indicates that the picker has an invalid value</td>
      <td>
        <code>boolean</code>
      </td>
      <td>false</td>
    </tr>
    <tr>
      <td>open-delay</td>
      <td>
        delay in milliseconds before the popover opens after being triggered
      </td>
      <td>
        <code>number</code>
      </td>
      <td>0</td>
    </tr>
    <tr>
      <td>close-delay</td>
      <td>
        delay in milliseconds before the popover closes after being triggered
      </td>
      <td>
        <code>number</code>
      </td>
      <td>150</td>
    </tr>
    <tr>
      <td>append-to-body</td>
      <td>
        determines if the popover content should be appended to the
        <code>body</code> instead of being nested within the DOM structure of
        the component
      </td>
      <td>
        <code>boolean</code>
      </td>
      <td>true</td>
    </tr>
    <tr>
      <td>stay-opened</td>
      <td>
        leave the picker open after opening it. Use it for debugging or
        researching a popover
      </td>
      <td>
        <code>boolean</code>
      </td>
      <td>false</td>
    </tr>
  </tbody>
</table>

### Events

<table>
  <thead>
    <tr>
      <td>Name</td>
      <td>Description</td>
      <td>Type</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>change</td>
      <td>triggered when the value was changed</td>
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
      <td>triggers when picker focuses</td>
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
      <td>triggered when the picker is no longer in focus</td>
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

### Slots

<table>
  <thead>
    <tr>
      <td>Name</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>default</td>
      <td>custom reference for popover</td>
    </tr>
    <tr>
      <td>separator</td>
      <td>custom range separator content</td>
    </tr>
  </tbody>
</table>

### Exposes

<table>
  <thead>
    <tr>
      <td>Name</td>
      <td>Description</td>
      <td>Type</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>popoverVisible</td>
      <td>returns whether the popover is currently open or not</td>
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
      <td>focus the picker component</td>
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
      <td>blur the picker component</td>
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
