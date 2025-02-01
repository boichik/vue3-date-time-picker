# Швидкий початок

У цьому розділі описано, як підключити та налаштувати <code>Vue3DateTimePicker</code>

## Використання

::: warning ПОПЕРЕДЖЕННЯ
Цей пакет не постачається разом з шрифтами, їх потрібно підключати окремо.
(За замовчуванням пакунок очікує шрифт <a href="https://fonts.google.com/specimen/Roboto" target="_blank" rel="noreferrer">Roboto</a>)
:::

Ви можете підключити компоненти глобально

```ts [main.ts]
import { createApp } from 'vue';
import App from './App.vue';
import { AppDateTimePicker, AppTimePicker } from 'vue3-date-time-picker';
import 'vue3-date-time-picker/lib/styles.css';

const app = createApp(App);

app.component('AppDateTimePicker', AppDateTimePicker);
app.component('AppTimePicker', AppTimePicker);
app.mount('#app');
```

А також ви можете підключити компоненти локально

::: code-group

```vue [Composition API]
<template>
  <AppDateTimePicker v-model="dateModel" />

  <AppTimePicker v-model="timeModel" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AppDateTimePicker, AppTimePicker } from 'vue3-date-time-picker';
import 'vue3-date-time-picker/lib/styles.css';

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
import { AppDateTimePicker, AppTimePicker } from 'vue3-date-time-picker';
import 'vue3-date-time-picker/lib/styles.css';
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

## Локалізація

Локалізація в цьому пакеті використовує два підходи, з <a href=«https://github.com/intlify/vue-i18n» target=«_blank» rel=«noreferrer»>vue-i18n</a> і без нього

::: info ІНФОРМАЦІЯ
Місяці, дні тижня тощо перекладаються за допомогою <code>Intl.DateTimeFormat</code>, а мова отримується з <code>i18n.locale</code> або <code>props.locale</code>
:::

Якщо ви використовуєте <code>vue-i18n</code>, вам потрібно лише додати певний список перекладів, який наведено нижче

```json
{
  "dp__apply": "Apply", // Кнопка підтвердження внизу поповера
  "dp__cancel": "Cancel" // Кнопка скасування внизу поповера
}
```

Приклад додавання до опцій <code>vue-i18n</code>:

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

Якщо ви НЕ використовуєте <code>vue-i18n</code>, вам потрібно лише передати компоненту відповідні пропси (їх можна знайти за <a href="../components/app-date-time-picker#api-атрибути">посиланням</a>)
