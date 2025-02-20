import { mount } from '@vue/test-utils';
import AppDateTimePickerContent from '@/components/app-date-time-picker/src/components/base/AppDateTimeContent.vue';
import AppButtonPanel from '@/ui/AppButtonPanel.vue';
import AppDateTimeShortcutPanel from '@/components/app-date-time-picker/src/components/panel/AppDateTimeShortcutPanel.vue';
import AppDateMode from '@/components/app-date-time-picker/src/components/mode/AppDateMode.vue';
import AppDateRangeMode from '@/components/app-date-time-picker/src/components/mode/AppDateRangeMode.vue';
import { AppDateTimePickerComponentDataProvide } from '@/components/app-date-time-picker/src/const';
import AppButton from '@/ui/AppButton.vue';
import { initResizeObserverMock } from '@tests/mocks/ResizeObserverMock';

describe('AppDateTimePickerContent', () => {
  initResizeObserverMock();

  const provideData = {
    type: 'date',
    today: new Date(2025, 0, 1),
    shortcuts: [] as any[],
    cancelText: 'Cancel',
    applyText: 'Apply',
    disabledApplyButton: false,
    applyChange: vi.fn(),
    cancelChange: vi.fn(),
  };

  const createWrapper = (provide = provideData) =>
    mount(AppDateTimePickerContent, {
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: { value: provide },
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

    expect(wrapper.classes()).not.toContain(
      'app-date-time-picker-content--with-shortcuts'
    );
  });

  it('renders AppDateTimeShortcutPanel if shortcuts are available', () => {
    const wrapper = createWrapper({
      ...provideData,
      shortcuts: [{ text: '1' }, { text: '2' }],
    });

    expect(wrapper.classes()).toContain(
      'app-date-time-picker-content--with-shortcuts'
    );
    const shortcutPanel = wrapper.findComponent(AppDateTimeShortcutPanel);

    expect(shortcutPanel.exists()).toBe(true);
  });

  it('does not render AppDateTimeShortcutPanel if no shortcuts are available', () => {
    const wrapper = createWrapper();
    const shortcutPanel = wrapper.findComponent(AppDateTimeShortcutPanel);

    expect(shortcutPanel.exists()).toBe(false);
  });

  it('render correct date mode component based on "type"', async () => {
    const wrapper = createWrapper({
      ...provideData,
      type: 'date',
    });

    expect(wrapper.findComponent(AppDateMode).exists()).toBe(true);
  });

  it('render correct date-time mode component based on "type"', async () => {
    const wrapper = createWrapper({
      ...provideData,
      type: 'datetime',
    });

    expect(wrapper.findComponent(AppDateMode).exists()).toBe(true);
  });

  it('render correct date-range mode component based on "type"', async () => {
    const wrapper = createWrapper({
      ...provideData,
      type: 'daterange',
    });

    expect(wrapper.findComponent(AppDateRangeMode).exists()).toBe(true);
  });

  it('render correct date-time-range mode component based on "type"', async () => {
    const wrapper = createWrapper({
      ...provideData,
      type: 'datetimerange',
    });

    expect(wrapper.findComponent(AppDateRangeMode).exists()).toBe(true);
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
