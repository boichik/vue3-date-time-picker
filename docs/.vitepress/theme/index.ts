import DefaultTheme from 'vitepress/theme';
import { AppDateTimePicker } from '../../../src/components/app-date-time-picker';
import AppDateTimeContent from '../../../src/components/app-date-time-picker/src/components/base/AppDateTimeContent.vue';
import { AppTimePicker } from '../../../src/components/app-time-picker';
import '../../../src/styles/variables.css';
import './style/index.scss';
import Layout from '../../components/custom/Layout.vue';

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app }) {
    app.component('AppDateTimeContent', AppDateTimeContent);
    app.component('AppDateTimePicker', AppDateTimePicker);
    app.component('AppTimePicker', AppTimePicker);

    const components = import.meta.glob('../../components/**/*.vue', {
      eager: true,
    });

    Object.entries(components).forEach(([path, module]) => {
      const componentName = path.split('/').pop()?.replace('.vue', '')!;
      app.component(componentName, (module as any).default);
    });
  },
};
