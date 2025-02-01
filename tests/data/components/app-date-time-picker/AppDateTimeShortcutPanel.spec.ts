import { mount } from '@vue/test-utils';
import AppDateTimeShortcutPanel from '@/components/app-date-time-picker/src/components/panel/AppDateTimeShortcutPanel.vue';
import AppScrollbar from '@/ui/AppScrollbar.vue';
import { AppDateTimePickerType } from '@/components/app-date-time-picker/src/enums/dateTimePickerType';
import { AppDateTimePickerComponentDataProvide } from '@/components/app-date-time-picker/src/const';

describe('AppDateTimeShortcutPanel.vue', () => {
  const mockShortcuts = [
    { text: 'Today', value: new Date() },
    { text: 'Yesterday', value: new Date(Date.now() - 86400000) },
  ];

  const mockComponentData = {
    shortcuts: mockShortcuts,
    type: AppDateTimePickerType.Date,
  };

  const provideMock = {
    [AppDateTimePickerComponentDataProvide]: {
      value: mockComponentData,
    },
  };

  it('renders correctly with shortcuts', () => {
    const wrapper = mount(AppDateTimeShortcutPanel, {
      global: {
        provide: provideMock,
        components: { AppScrollbar },
      },
    });

    const listItems = wrapper.findAll(
      '.app-date-time-shortcut-panel__list-item'
    );
    expect(listItems).toHaveLength(mockShortcuts.length);
    expect(listItems[0].text()).toBe('Today');
    expect(listItems[1].text()).toBe('Yesterday');
  });

  it('emits "select" event with the correct value on click', async () => {
    const wrapper = mount(AppDateTimeShortcutPanel, {
      global: {
        provide: provideMock,
        components: { AppScrollbar },
      },
    });

    const listItems = wrapper.findAll(
      '.app-date-time-shortcut-panel__list-item'
    );
    await listItems[0].trigger('click');

    expect(wrapper.emitted().select).toHaveLength(1);
    expect(wrapper.emitted().select[0]).toEqual([mockShortcuts[0].value]);
  });

  it('does not emit "select" if value is invalid', async () => {
    const invalidValueMock = {
      shortcuts: [{ text: 'Invalid', value: 'invalid-date' }],
      type: AppDateTimePickerType.Date,
    };

    const wrapper = mount(AppDateTimeShortcutPanel, {
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: {
            value: invalidValueMock,
          },
        },
        components: { AppScrollbar },
      },
    });

    const listItems = wrapper.findAll(
      '.app-date-time-shortcut-panel__list-item'
    );
    await listItems[0].trigger('click');

    expect(wrapper.emitted().select).toBeUndefined();
  });

  it('displays no shortcuts if none are provided', () => {
    const emptyMock = {
      shortcuts: [],
      type: AppDateTimePickerType.Date,
    };

    const wrapper = mount(AppDateTimeShortcutPanel, {
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: {
            value: emptyMock,
          },
        },
        components: { AppScrollbar },
      },
    });

    const listItems = wrapper.findAll(
      '.app-date-time-shortcut-panel__list-item'
    );
    expect(listItems).toHaveLength(0);
  });

  it('renders with AppScrollbar', () => {
    const wrapper = mount(AppDateTimeShortcutPanel, {
      global: {
        provide: provideMock,
        components: { AppScrollbar },
      },
    });

    const scrollbar = wrapper.findComponent(AppScrollbar);
    expect(scrollbar.exists()).toBe(true);
  });
});
