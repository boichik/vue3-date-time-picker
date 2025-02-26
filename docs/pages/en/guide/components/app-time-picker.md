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

<DocsTitle text="TimePicker" />

<code>TimePicker</code> component for entering time

<DocsTitle text="Usual time selection" :level="2" />

You can select the time by entering data in the input or the time selection panel

<AppTimePicker v-model="model" placeholder="Select time"/>

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

<DocsTitle text="Selecting a time range" :level="2" />

Using the <code>is-range</code> attribute, the picker will start working in the time range selection mode

::: tip
Please note that if you do not use the <code>selectable-range</code> attribute and if the <code>is-range=‘true’</code> attribute is set, the picker will automatically determine the valid range based on the selected data.
:::

<AppTimePicker v-model="rangeModel" is-range start-placeholder="Start time" end-placeholder="End time"/>

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

<DocsTitle text="Default time" :level="2" />

In the picker, you can set the time that will be substituted by default when the user opens it for the first time.
You can configure both for one picker and for each picker separately.

<AppTimePicker v-model="defaultTimeModel" :default-time="defaultTime" placeholder="Select time"/>

<br>

<AppTimePicker v-model="defaultTimeRangeModel" is-range :default-time="defaultTimeRange" start-placeholder="Start time" end-placeholder="End time"/>

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

<DocsTitle text="Formats" :level="2" />

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

<DocsTitle text="Limit the time range" :level="2" />

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

<DocsTitle text="API" :level="2" />
<DocsTitle text="Attributes" :level="3" />

<TimeTable />

<DocsTitle text="Events" :level="3" />

<TimeTable type="event" />

<DocsTitle text="Slots" :level="3" />

<TimeTable type="slot" />

<DocsTitle text="Default slot" :level="4" version="^0.0.2" />

This slot is a replacement for the date entry field. Below is a table with the available props for this slot

<TimeTable type="default-slot" />

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

<DocsTitle text="Exposes" :level="3" />

<TimeTable type="expose" />
