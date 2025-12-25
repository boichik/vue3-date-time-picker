import { shallowMount } from '@vue/test-utils';
import AppButton from './Index.vue';

describe('AppButton', () => {
  const createWrapper = (
    props?: InstanceType<typeof AppButton>['$props'],
    content: string = 'Click me'
  ) => shallowMount(AppButton, { props, slots: { default: content } });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be rendered correctly', () => {
    const wrapper = createWrapper();

    expect(wrapper.exists()).toBe(true);

    expect(wrapper.props('disabled')).toBe(false);
    expect(wrapper.text()).toBe('Click me');
  });

  it('should accept "disabled" prop correctly', () => {
    const wrapper = createWrapper({ disabled: true });

    expect(wrapper.props('disabled')).toBe(true);
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('should emit click valuent when clicked', async () => {
    const wrapper = createWrapper();

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeDefined();
    expect(wrapper.emitted('click')?.length).toBe(1);
  });

  it('should not emit click event when disabled', async () => {
    const wrapper = createWrapper({ disabled: true });

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeUndefined();
  });
});
