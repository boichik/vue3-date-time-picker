<template>
  <DefaultTheme.Layout>
    <template #home-hero-image>
      <div class="custom-home-container">
        <div class="custom-home-container__bg"></div>
        <PopoverContent
          :is-uk-locale="isUkLocale"
          class="custom-home-container__content"
        />
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import PopoverContent from './PopoverContent.vue';
import { useData } from 'vitepress';
import { computed } from 'vue';

const { lang } = useData();

const isUkLocale = computed(() => lang.value === 'uk');
</script>

<style lang="scss">
.custom-home-container {
  position: relative;

  &__icon {
    width: 155px;
    color: var(--vpick--color-primary-active);

    @media (min-width: 960px) {
      display: none;
    }
  }

  &__content {
    @media (max-width: 960px) {
      display: none;
    }
  }

  &__bg {
    position: absolute;
    top: calc(50% - 160px);
    border-radius: 50%;
    background: radial-gradient(
      circle,
      var(--vpick--color-primary) 0%,
      var(--vpick--color-background-blue-light) 100%
    );
    width: 100%;
    height: 320px;
    filter: blur(65px);
    z-index: -1;

    @media (max-width: 960px) {
      display: none;
    }
  }
}
</style>
