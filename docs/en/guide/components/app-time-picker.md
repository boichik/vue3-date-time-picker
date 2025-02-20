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

<code>TimePicker</code> component for entering time

## Usual time selection

You can select the time by entering data in the input or the time selection panel

<AppTimePicker placeholder="Select time"/>

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker v-model="model" placeholder="Select time" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppTimePicker v-model="model" placeholder="Select time" />
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

## Selecting a time range

Using the <code>is-range</code> attribute, the picker will start working in the time range selection mode

::: tip
Please note that if you do not use the <code>selectable-range</code> attribute and if the <code>is-range=‘true’</code> attribute is set, the picker will automatically determine the valid range based on the selected data.
:::

<AppTimePicker is-range start-placeholder="Start time" end-placeholder="End time"/>

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker
    v-model="model"
    is-range
    start-placeholder="Start time"
    end-placeholder="End time"
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
    start-placeholder="Start time"
    end-placeholder="End time"
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

## Default time

In the picker, you can set the time that will be substituted by default when the user opens it for the first time.
You can configure both for one picker and for each picker separately.

<AppTimePicker :default-time="defaultTime" placeholder="Select time"/>

<br>

<AppTimePicker is-range :default-time="defaultTimeRange" start-placeholder="Start time" end-placeholder="End time"/>

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker
    v-model="modelFirst"
    :default-time="defaultTime"
    placeholder="Select time"
  />

  <AppTimePicker
    v-model="modelLast"
    is-range
    :default-time="defaultTimeRange"
    start-placeholder="Start time"
    end-placeholder="End time"
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
    placeholder="Select time"
  />

  <AppTimePicker
    v-model="modelLast"
    is-range
    :default-time="defaultTimeRange"
    start-placeholder="Start time"
    end-placeholder="End time"
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

## Formats

In this component, you can configure the format in which the date will be displayed in the input.
Also, unlike the <code>DateTimePicker</code>, the format affects the display of the panels in the popover.

::: tip
To learn more about the available formats, follow this [link](../formats)
:::

<p>Display of hours and minutes only:</p>

<AppTimePicker v-model="hourMinutesModel" format="HH:mm" placeholder="HH:mm"/>

<p>Time display with AM\PM:</p>

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

## Limit the time range

With the <code>selectable-range</code> attribute, you can limit the time selection for the user.
This attribute works for picker in normal mode and in range selection.

::: warning
The attribute has a strict format, namely <code>‘HH:mm:ss - HH:mm:ss’</code>, and for the range selection mode <code>[‘HH:mm:ss - HH:mm:ss’, ‘HH:mm:ss - HH:mm:ss’]</code>.
:::

::: info
If the picker does not have an initial value and the <code>selectable-range</code> attribute is configured, the time that will be selected by default (the current time or the time that was passed in the <code>default-time</code> attribute) will be determined relative to the <code>selectable-range</code> attribute.

- If the current time is less than the initial time, the initial time will be selected
- If the current time is greater than the end time, the end time will be selected
- If the current time is in the range, it will be selected

:::

<br>

<AppTimePicker selectable-range="12:30:30 - 16:00:00" placeholder="Select time"/>

<br>

<AppTimePicker is-range :selectable-range="['12:30:30 - 16:00:00', '12:00:30 - 14:30:00']" start-placeholder="Start time" end-placeholder="End time" />

<br>

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker
    v-model="modelFirst"
    selectable-range="12:30:30 - 16:00:00"
    placeholder="Select time"
  />

  <AppTimePicker
    v-model="modelLast"
    is-range
    :selectable-range="['12:30:30 - 16:00:00', '12:00:30 - 14:30:00']"
    start-placeholder="Start time"
    end-placeholder="End time"
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
    placeholder="Select time"
  />

  <AppTimePicker
    v-model="modelLast"
    is-range
    :selectable-range="['12:30:30 - 16:00:00', '12:00:30 - 14:30:00']"
    start-placeholder="Start time"
    end-placeholder="End time"
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
      <td>is-range</td>
      <td>whether to display the picker in the time range selection mode</td>
      <td>
        <code>boolean</code> 
      </td>
      <td>false</td>
    </tr>
    <tr>
      <td>time-format</td>
      <td>
        the format in which the time in the picker will be displayed, as well as the corresponding panels in the popover
        <a href="#formats">more</a>
      </td>
      <td>
        <code>string</code>
      </td>
      <td>HH:mm:ss</td>
    </tr>
    <tr>
      <td>default-time</td>
      <td>
        the time that will be set by default.
        <a href="#default-time">more</a>
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
        limitation for time selection. The expected format is <code>“HH:mm:ss - HH:mm:ss"</code> <br> <code>[“HH:mm:ss - HH:mm:ss",“HH:mm:ss - HH:mm:ss"]</code>.
        <a href="#limit-the-time-range">more</a>
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
      <td>
        <div class="vi-table__cell--flex">
          <span>input-readonly</span>
          <Badge type="tip" text="^0.0.2" />
        </div>
      </td>
      <td>switch the inputs to read-only mode, but through the popover it is possible to select the date</td>
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
        the text that will be displayed in the input when the picker is not in the range selection mode
      </td>
      <td>
        <code>string</code>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>start-placeholder</td>
      <td>
        the text that will be displayed in the first input when the picker is in the range selection mode
      </td>
      <td>
        <code>string</code>
      </td>
      <td>"</td>
    </tr>
    <tr>
      <td>end-placeholder</td>
      <td>
        the text that will be displayed in the last input when the picker is in the range selection mode
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

#### Default slot <Badge type="tip" text="^0.0.2" />

This slot is a replacement for the date entry field. Below is a table with the available props for this slot

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
      <td>value</td>
      <td>The value that is passed to the input (without formatting)</td>
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
      <td>returns whether the popover is currently open or not</td>
      <td>
        boolean
      </td>
    </tr>
    <tr>
      <td>input</td>
      <td>setting a new value in the picker</td>
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

<br>

<TimeDefaultSlotExample />

::: code-group

```vue [Composition API]
<template>
  <AppTimePicker v-model="model">
    <template #default="{ value, popoverVisible, input, focus }">
      <input
        :value="dateToStringTime(value)"
        :class="{ 'custom-input--focus': popoverVisible }"
        class="custom-input"
        placeholder="Select time"
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
        placeholder="Select time"
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
