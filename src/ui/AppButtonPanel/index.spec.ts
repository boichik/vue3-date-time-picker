import { shallowMount } from '@vue/test-utils';
import AppButtonPanel from './Index.vue';

const { mockState } = vi.hoisted(() => ({
  mockState: { hasLocalization: false, withPrefix: false },
}));

vi.mock('@/composables/useLocalization', () => ({
  useLocalization: () => {
    if (!mockState.hasLocalization) {
      return undefined;
    }
    return {
      t: (key: string) => (mockState.withPrefix ? `prefix.${key}` : key),
    };
  },
}));

describe('AppButtonPanel', () => {
  const createWrapper = (
    props?: InstanceType<typeof AppButtonPanel>['$props']
  ) =>
    shallowMount(AppButtonPanel, {
      props,
      global: {
        stubs: {
          AppButton: {
            template: '<button><slot /></button>',
            props: ['type', 'disabled'],
            name: 'AppButton',
          },
        },
      },
    });

  beforeEach(() => {
    vi.clearAllMocks();

    mockState.hasLocalization = false;
    mockState.withPrefix = false;
  });

  it('should be rendered correctly', () => {
    const wrapper = createWrapper();

    expect(wrapper.exists()).toBe(true);

    const buttons = wrapper.findAllComponents({ name: 'AppButton' });
    expect(buttons.length).toBe(2);
  });

  it.each([
    [0, { hasLocalization: false, withPrefix: false }, undefined, 'Cancel'],
    [0, { hasLocalization: true, withPrefix: false }, undefined, 'Cancel'],
    [
      0,
      { hasLocalization: true, withPrefix: true },
      undefined,
      'prefix.dp__cancel',
    ],
    [
      0,
      { hasLocalization: false, withPrefix: false },
      { cancelText: 'Abort' },
      'Abort',
    ],
    [
      0,
      { hasLocalization: true, withPrefix: false },
      { cancelText: 'Abort' },
      'Abort',
    ],
    [
      0,
      { hasLocalization: true, withPrefix: true },
      { cancelText: 'Abort' },
      'prefix.dp__cancel',
    ],
    [1, { hasLocalization: false, withPrefix: false }, undefined, 'Apply'],
    [1, { hasLocalization: true, withPrefix: false }, undefined, 'Apply'],
    [
      1,
      { hasLocalization: true, withPrefix: true },
      undefined,
      'prefix.dp__apply',
    ],
    [
      1,
      { hasLocalization: false, withPrefix: false },
      { applyText: 'Confirm' },
      'Confirm',
    ],
    [
      1,
      { hasLocalization: true, withPrefix: false },
      { applyText: 'Confirm' },
      'Confirm',
    ],
    [
      1,
      { hasLocalization: true, withPrefix: true },
      { applyText: 'Confirm' },
      'prefix.dp__apply',
    ],
  ])(
    'should render button %i with localization=%s and props=%o with text="%s"',
    (buttonIndex, state, props, expectedText) => {
      mockState.hasLocalization = state.hasLocalization;
      mockState.withPrefix = state.withPrefix;

      const wrapper = createWrapper(props);

      const buttons = wrapper.findAllComponents({ name: 'AppButton' });
      const button = buttons[buttonIndex];

      expect(button.exists()).toBe(true);
      expect(button.text()).toBe(expectedText as string);
    }
  );

  it('apply button must have the correct props', () => {
    const wrapper = createWrapper();
    const buttons = wrapper.findAllComponents({ name: 'AppButton' });
    const applyButton = buttons[1];

    expect(applyButton.props('type')).toBe('submit');
    expect(applyButton.props('disabled')).toBe(false);
  });

  it('apply button must be disabled when prop is set', () => {
    const wrapper = createWrapper({ disabled: true });
    const buttons = wrapper.findAllComponents({ name: 'AppButton' });
    const applyButton = buttons[1];

    expect(applyButton.props('disabled')).toBe(true);
  });

  it('should emit events on button clicks', async () => {
    const wrapper = createWrapper();

    const buttons = wrapper.findAllComponents({ name: 'AppButton' });
    const cancelButton = buttons[0];
    const applyButton = buttons[1];

    await cancelButton.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('cancel');

    await applyButton.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('apply');
  });
});
