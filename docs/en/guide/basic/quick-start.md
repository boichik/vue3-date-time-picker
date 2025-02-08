# Quick Start

This section describes how to connect and configure the <code>Vue3DateTimePicker</code>

## Usage

::: warning
This package does not come with fonts, they need to be connected separately.
(By default, the package is expected to include the <a href="https://fonts.google.com/specimen/Roboto" target="_blank" rel="noreferrer">Roboto</a> font)
:::

You can connect components globally

```ts [main.ts]
import { createApp } from 'vue';
import App from './App.vue';
import {
  AppDateTimePicker,
  AppTimePicker,
} from '@boichikpro/vue3-date-time-picker';
import '@boichikpro/vue3-date-time-picker/assets/style.css';
import '@boichikpro/vue3-date-time-picker/assets/variables.css';

const app = createApp(App);

app.component('AppDateTimePicker', AppDateTimePicker);
app.component('AppTimePicker', AppTimePicker);
app.mount('#app');
```

You can also connect the components locally

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker v-model="dateModel" />

  <AppTimePicker v-model="timeModel" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  AppDateTimePicker,
  AppTimePicker,
} from '@boichikpro/vue3-date-time-picker';
import '@boichikpro/vue3-date-time-picker/assets/style.css';
import '@boichikpro/vue3-date-time-picker/assets/variables.css';

const dateModel = ref(null);
const timeModel = ref(null);
</script>
```

```vue [Options API]
<template>
  <AppDateTimePicker v-model="dateModel" />

  <AppTimePicker v-model="timeModel" />
</template>

<script>
import {
  AppDateTimePicker,
  AppTimePicker,
} from '@boichikpro/vue3-date-time-picker';
import '@boichikpro/vue3-date-time-picker/assets/style.css';
import '@boichikpro/vue3-date-time-picker/assets/variables.css';

export default {
  components: { AppDateTimePicker, AppTimePicker },
  data() {
    return {
      dateModel: null,
      timeModel: null,
    };
  },
};
</script>
```

:::

## Localization

Localization in this package uses two approaches, with and without <a href="https://github.com/intlify/vue-i18n" target="_blank" rel="noreferrer">vue-i18n</a>

::: info
Months, days of the week, etc. are translated using <code>Intl.DateTimeFormat</code>, and the language is obtained from <code>i18n.locale</code> or <code>props.locale</code>
:::

If you are using <code>vue-i18n</code>, you only need to add a specific list of translations, which is listed below

```json
{
  "dp__apply": "Apply", // Confirmation button at the bottom of the popover
  "dp__cancel": "Cancel" // Undo button at the bottom of the popover
}
```

Example of adding to <code>vue-i18n</code> options:

```ts
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      dp__apply: 'Apply',
      dp__cancel: 'Cancel',
    },
    uk: {
      dp__apply: 'Застосувати',
      dp__cancel: 'Скасувати',
    },
  },
});

const app = createApp({
  // something vue options here ...
});

app.use(i18n);
app.mount('#app');
```

If you are NOT using <code>vue-i18n</code>, you only need to pass the appropriate props to the component (you can find them at the <a href="../components/app-date-time-picker#attributes">link</a>)
