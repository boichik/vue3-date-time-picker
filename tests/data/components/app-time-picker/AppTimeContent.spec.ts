import { mount } from '@vue/test-utils';
import AppButtonPanel from '@/ui/AppButtonPanel.vue';
import AppButton from '@/ui/AppButton.vue';
import AppTimeContent from '@/components/app-time-picker/src/components/base/AppTimeContent.vue';
import { AppTimePickerComponentDataProvide } from '@/components/app-time-picker/src/const';
import AppTimeDefaultMode from '@/components/app-time-picker/src/components/mode/AppTimeDefaultMode.vue';
import AppTimeRangeMode from '@/components/app-time-picker/src/components/mode/AppTimeRangeMode.vue';
import { initResizeObserverMock } from '@tests/mocks/ResizeObserverMock';

describe('AppTimePickerContent', () => {
  initResizeObserverMock();

  const provideData = {
    isRange: false,
    today: new Date(2025, 0, 1),
    cancelText: 'Cancel',
    applyText: 'Apply',
    disabledApplyButton: false,
    applyChange: vi.fn(),
    cancelChange: vi.fn(),
  };

  const createWrapper = (provide = provideData) =>
    mount(AppTimeContent, {
      global: {
        provide: {
          [AppTimePickerComponentDataProvide]: { value: provide },
        },
      },
    });

  it('renders AppButtonPanel with correct props', () => {
    const wrapper = createWrapper();
    const buttonPanel = wrapper.findComponent(AppButtonPanel);

    expect(buttonPanel.exists()).toBe(true);
    expect(buttonPanel.props('cancelText')).toBe(provideData.cancelText);
    expect(buttonPanel.props('applyText')).toBe(provideData.applyText);
    expect(buttonPanel.props('disabled')).toBe(provideData.disabledApplyButton);
  });

  it('should display the correct default mode with respect to the parameters', async () => {
    const wrapper = createWrapper({
      ...provideData,
      isRange: false,
    });

    expect(wrapper.findComponent(AppTimeDefaultMode).exists()).toBe(true);
  });

  it('should display the correct range mode relative to the parameters', async () => {
    const wrapper = createWrapper({
      ...provideData,
      isRange: true,
    });

    expect(wrapper.findComponent(AppTimeRangeMode).exists()).toBe(true);
  });

  it('calls applyChange and cancelChange when corresponding buttons are clicked', async () => {
    const wrapper = createWrapper();

    const [cancel, submit] = wrapper.findAllComponents(AppButton);

    expect(cancel.exists()).toBeTruthy();
    expect(submit.exists()).toBeTruthy();

    await Promise.all([cancel.trigger('click'), submit.trigger('click')]);

    expect(provideData.applyChange).toHaveBeenCalled();
    expect(provideData.cancelChange).toHaveBeenCalled();
  });
});
