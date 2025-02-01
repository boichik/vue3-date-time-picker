# Встановлення

У цьому розділі описано, як встановити <code>Vue3DateTimePicker</code> у вашому проекті

## Vue

Щоб використовувати поточну версію пакета або новішу, мінімальна сумісна версія <a href="https://vuejs.org/" target="_blank" rel="noreferrer">Vue.js</a> має бути <code>3.5.12</code>

## Sass

Щоб використовувати поточну версію пакета або новішу, мінімальна сумісна версія <a href="https://github.com/sass" target="_blank" rel="noreferrer">Sass</a> має бути <code>1.80.6</code>

::: tip
якщо ваш термінал видає попередження <code>JS API Deprecation Warning</code>, ви можете налаштувати наступний код в <a href="https://vite.dev/config/shared-options.html#css-preprocessoroptions" target="_blank" rel="noreferrer">vite.config</a>

```ts
 css: {
   preprocessorOptions: {
     scss: { api: 'modern-compiler' },
   }
 }
```

:::

## Використання менеджера пакетів

::: code-group

```shell [npm]
$ npm install vue3-datetime-picker
```

```shell [yarn]
$ yarn add vue3-datetime-picker
```

```shell [pnpm]
$ pnpm install vue3-datetime-picker
```

:::
