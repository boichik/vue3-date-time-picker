# Vue3DateTimePicker

Modern, lightweight, and flexible date and time picker for Vue 3. 🚀

## 📌 Features

- 📆 **Date & Time Selection** – Supports date, time, and range selection.
- 🌍 **Localization** – Works with `vue-i18n` or standalone locale props.
- 🎨 **Customizable** – Styled via CSS variables for easy theming.
- ⚡ **Performance Optimized** – Lightweight and fast.
- 🛠️ **Fully Typed** – Written in TypeScript with full type support.

## 📥 Installation

    npm install vue3-date-time-picker
    # or
    yarn add vue3-date-time-picker
    # or
    pnpm add vue3-date-time-picker

## 🚀 Quick Start

### **Global Registration**

    import { createApp } from 'vue';
    import App from './App.vue';
    import { AppDateTimePicker, AppTimePicker } from 'vue3-date-time-picker';
    import 'vue3-date-time-picker/assets/style.css';
    import 'vue3-date-time-picker/assets/variables.css';

    const app = createApp(App);
    app.component('AppDateTimePicker', AppDateTimePicker);
    app.component('AppTimePicker', AppTimePicker);
    app.mount('#app');

### **Local Import**

    <template>
        <AppDateTimePicker v-model="date" />
        <AppTimePicker v-model="time" />
    </template>

    <script setup>
    import { ref } from 'vue';
    import { AppDateTimePicker, AppTimePicker } from 'vue3-date-time-picker';
    import 'vue3-date-time-picker/assets/style.css';
    import 'vue3-date-time-picker/assets/variables.css';

    const date = ref(null);
    const time = ref(null);
    </script>

## 📖 Documentation

Full documentation is available at 👉 **[docs](https://boichik.github.io/vue3-date-time-picker)**

## 🛠️ Contributing

Feel free to submit PRs or issues! ❤️

## 📜 License

MIT License © boichik
