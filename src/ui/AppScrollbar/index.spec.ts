import { shallowMount } from '@vue/test-utils';
import AppScrollbar from './Index.vue';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('AppScrollbar', () => {
  const createWrapper = (
    props?: Partial<InstanceType<typeof AppScrollbar>['$props']>
  ) => {
    return shallowMount(AppScrollbar, {
      props,
      global: {
        stubs: {
          PerfectScrollbar: {
            template: '<div><slot /></div>',
            name: 'PerfectScrollbar',
            props: ['options', 'tag', 'watchOptions'],
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);

    const perfectScrollbar = wrapper.findComponent({
      name: 'PerfectScrollbar',
    });
    expect(perfectScrollbar.exists()).toBe(true);
  });

  it('should render slot content', () => {
    const wrapper = shallowMount(AppScrollbar, {
      slots: {
        default: '<div id="test-content">Content</div>',
      },
      global: {
        stubs: {
          PerfectScrollbar: {
            template: '<div><slot /></div>',
            name: 'PerfectScrollbar',
          },
        },
      },
    });

    const content = wrapper.find('#test-content');
    expect(content.exists()).toBe(true);
    expect(content.text()).toBe('Content');
  });

  it('should expose ps instance', () => {
    const wrapper = createWrapper();
    expect(wrapper.vm.ps).toBeUndefined();
  });
});
