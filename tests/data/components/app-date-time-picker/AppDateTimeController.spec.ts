import AppYearTable from '@/components/app-date-time-picker/src/components/table/AppYearTable.vue';
import AppMonthTable from '@/components/app-date-time-picker/src/components/table/AppMonthTable.vue';
import AppDayTable from '@/components/app-date-time-picker/src/components/table/AppDayTable.vue';
import AppDateTimeController from '@/components/app-date-time-picker/src/components/controller/AppDateTimeController.vue';
import AppDateTimePickerPanel from '@/components/app-date-time-picker/src/components/panel/AppDateTimePanel.vue';
import { DateTimePickerMode } from '@/components/app-date-time-picker/src/enums/dateTimePickerMode';
import { mount } from '@vue/test-utils';
import { subMonths, subYears } from 'date-fns';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerTableComponentDataProvide,
} from '@/components/app-date-time-picker/src/const';

describe('AppDateTimeController', () => {
  const mockDate = new Date(2025, 0, 1);

  const mockComponentData = {
    firstDayOfWeek: 1,
    today: mockDate,
    locale: 'en-US',
    weekdayFormat: 'short',
    disabledDate: vi.fn(),
  };

  const mockTableComponentData = {
    isSelectedDate: vi.fn(),
    isDateInRange: vi.fn(),
    isDateHoverRange: vi.fn(),
    selectDate: vi.fn(),
    hoverDate: vi.fn(),
    resetHover: vi.fn(),
  };

  const mountComponent = (props = {}, modelValue = mockDate) =>
    mount(AppDateTimeController, {
      props: {
        selectedDate: mockDate,
        mode: DateTimePickerMode.Day,
        modelValue,
        ...props,
      },
      provide: {
        [AppDateTimePickerComponentDataProvide]: { value: mockComponentData },
        [AppDateTimePickerTableComponentDataProvide]: mockTableComponentData,
      },
    });

  it('render child components', () => {
    const wrapper = mountComponent();

    expect(wrapper.findComponent(AppDateTimePickerPanel).exists()).toBe(true);
    expect(wrapper.findComponent(AppDayTable).exists()).toBe(true);
    expect(wrapper.findComponent(AppMonthTable).exists()).toBe(true);
    expect(wrapper.findComponent(AppYearTable).exists()).toBe(true);
  });

  it('displays the correct component depending on the mode', async () => {
    const wrapper = mountComponent();

    expect(wrapper.findComponent(AppDayTable).isVisible()).toBe(true);
    expect(wrapper.findComponent(AppMonthTable).isVisible()).toBe(false);
    expect(wrapper.findComponent(AppYearTable).isVisible()).toBe(false);

    await wrapper.setProps({ mode: DateTimePickerMode.Month });

    expect(wrapper.findComponent(AppDayTable).isVisible()).toBe(false);
    expect(wrapper.findComponent(AppMonthTable).isVisible()).toBe(true);
    expect(wrapper.findComponent(AppYearTable).isVisible()).toBe(false);

    await wrapper.setProps({ mode: DateTimePickerMode.Year });
    expect(wrapper.findComponent(AppDayTable).isVisible()).toBe(false);
    expect(wrapper.findComponent(AppMonthTable).isVisible()).toBe(false);
    expect(wrapper.findComponent(AppYearTable).isVisible()).toBe(true);
  });

  it('calls handleScroll on the wheel event', async () => {
    const wrapper = mountComponent();
    const panelMock = { handleSelectByScroll: vi.fn() };

    (wrapper.vm as any).panel = panelMock;
    await wrapper.vm.$nextTick();

    await wrapper.find('.app-date-time-controller-content').trigger('wheel');
    expect(panelMock.handleSelectByScroll).toHaveBeenCalled();
  });

  it('updates the current date when calling prevMonth, nextMonth, prevYear, nextYear', () => {
    const wrapper = mountComponent();
    const vm = wrapper.vm as any;

    vm.prevMonth(1);
    expect(vm.model).toEqual(subMonths(mockDate, 1));

    vm.nextMonth(1);
    expect(vm.model).toEqual(mockDate);

    vm.prevYear(1);
    expect(vm.model).toEqual(subYears(mockDate, 1));

    vm.nextYear(1);
    expect(vm.model).toEqual(mockDate);
  });

  it('changes the mode when calling handleChangeMode', () => {
    const wrapper = mountComponent();
    const vm = wrapper.vm as any;

    vm.handleChangeMode(DateTimePickerMode.Month);
    expect(vm.mode).toBe(DateTimePickerMode.Month);

    vm.handleChangeMode(DateTimePickerMode.Year);
    expect(vm.mode).toBe(DateTimePickerMode.Year);
  });

  it('updates the date on the update event in child components', async () => {
    const newDate = new Date(2025, 5, 15);
    const wrapper = mountComponent();

    await wrapper.findComponent(AppDayTable).vm.$emit('update', newDate);
    expect((wrapper.vm as any).model).toEqual(newDate);
  });
});
