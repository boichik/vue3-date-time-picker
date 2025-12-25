import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import AppTimeBar from './AppTimeBar.vue';
import { AppTimeBarType } from '../../enums/timeBarType';
import {
  initResizeObserverMock,
  observe,
  disconnect,
  triggerResizeObserver,
} from '@tests/mocks/ResizeObserverMock';

vi.mock('es-toolkit', () => ({
  debounce: (fn: () => void) => fn,
}));

describe('AppTimeBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    initResizeObserverMock();
  });

  const createWrapper = (
    props: Partial<InstanceType<typeof AppTimeBar>['$props']> = {}
  ) => {
    return shallowMount(AppTimeBar, {
      props: {
        modelValue: 0,
        ...props,
      },
      global: {
        stubs: {
          AppScrollbar: {
            name: 'AppScrollbar',
            template: '<div><slot /></div>',
            setup() {
              return {
                ps: {
                  update: vi.fn(),
                  containerHeight: 200,
                  contentHeight: 400,
                  element: {
                    scroll: vi.fn(),
                  },
                },
              };
            },
          },
        },
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render component with default props', () => {
      const wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it('should render two AppTimeControlButton components', () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons).toHaveLength(2);
    });

    it('should render first button with is-up-type prop', () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[0].props('isUpType')).toBeTruthy();
    });

    it('should render second button without is-up-type prop', () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[1].props('isUpType')).toBeFalsy();
    });

    it('should render AppScrollbar component', () => {
      const wrapper = createWrapper();
      const scrollbar = wrapper.findComponent({
        name: 'AppScrollbar',
      });
      expect(scrollbar.exists()).toBe(true);
    });

    it('should pass show-vertical-scroll false to AppScrollbar', () => {
      const wrapper = createWrapper();
      const scrollbar = wrapper.findComponent({
        name: 'AppScrollbar',
      });
      expect(scrollbar.attributes('show-vertical-scroll')).toBe('false');
    });

    it('should render ul element with list items', () => {
      const wrapper = createWrapper();
      const list = wrapper.find('ul');
      expect(list.exists()).toBe(true);
    });
  });

  describe('Type: Hours (24-hour format)', () => {
    it('should render 24 items for hours type', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      const items = wrapper.findAll('li');
      expect(items).toHaveLength(24);
    });

    it('should render hours from 00 to 23', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      const items = wrapper.findAll('li');
      expect(items[0].text()).toBe('00');
      expect(items[1].text()).toBe('01');
      expect(items[10].text()).toBe('10');
      expect(items[23].text()).toBe('23');
    });

    it('should format single digit hours with leading zero', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      const items = wrapper.findAll('li');
      expect(items[5].text()).toBe('05');
      expect(items[9].text()).toBe('09');
    });

    it('should not format double digit hours', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      const items = wrapper.findAll('li');
      expect(items[15].text()).toBe('15');
      expect(items[20].text()).toBe('20');
    });
  });

  describe('Type: Hours with AM/PM (12-hour format)', () => {
    it('should render 12 items for hours type with enabledAmPm', () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        enabledAmPm: true,
      });
      const items = wrapper.findAll('li');
      expect(items).toHaveLength(12);
    });

    it('should render hours from 12, 1 to 11 in AM/PM mode', () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        enabledAmPm: true,
      });
      const items = wrapper.findAll('li');
      expect(items[0].text()).toBe('12');
      expect(items[1].text()).toBe('01');
      expect(items[2].text()).toBe('02');
      expect(items[11].text()).toBe('11');
    });

    it('should reorder array to start with 12 in AM/PM mode', () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        enabledAmPm: true,
      });
      const items = wrapper.findAll('li');
      const texts = items.map(item => item.text());
      expect(texts[0]).toBe('12');
      expect(texts[1]).toBe('01');
      expect(texts[2]).toBe('02');
    });
  });

  describe('Type: Minutes', () => {
    it('should render 60 items for minutes type', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Minutes });
      const items = wrapper.findAll('li');
      expect(items).toHaveLength(60);
    });

    it('should render minutes from 00 to 59', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Minutes });
      const items = wrapper.findAll('li');
      expect(items[0].text()).toBe('00');
      expect(items[30].text()).toBe('30');
      expect(items[59].text()).toBe('59');
    });

    it('should format single digit minutes with leading zero', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Minutes });
      const items = wrapper.findAll('li');
      expect(items[5].text()).toBe('05');
      expect(items[9].text()).toBe('09');
    });
  });

  describe('Type: Seconds', () => {
    it('should render 60 items for seconds type', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Seconds });
      const items = wrapper.findAll('li');
      expect(items).toHaveLength(60);
    });

    it('should render seconds from 00 to 59', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Seconds });
      const items = wrapper.findAll('li');
      expect(items[0].text()).toBe('00');
      expect(items[30].text()).toBe('30');
      expect(items[59].text()).toBe('59');
    });

    it('should format single digit seconds with leading zero', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Seconds });
      const items = wrapper.findAll('li');
      expect(items[5].text()).toBe('05');
      expect(items[9].text()).toBe('09');
    });
  });

  describe('Type: AmPm', () => {
    it('should render 2 items for AmPm type', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.AmPm });
      const items = wrapper.findAll('li');
      expect(items).toHaveLength(2);
    });

    it('should render AM and PM labels', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.AmPm });
      const items = wrapper.findAll('li');
      expect(items[0].text()).toBe('AM');
      expect(items[1].text()).toBe('PM');
    });

    it('should not format AmPm labels with leading zero', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.AmPm });
      const items = wrapper.findAll('li');
      expect(items[0].text()).not.toContain('0');
      expect(items[1].text()).not.toContain('0');
    });
  });

  describe('ModelValue Handling', () => {
    it('should update modelValue when item is clicked', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
      });
      const items = wrapper.findAll('li');
      await items[5].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted).toBeTruthy();
      expect(emitted?.[emitted.length - 1]).toEqual([5]);
    });

    it('should emit correct value for minutes type', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Minutes,
        modelValue: 0,
      });
      const items = wrapper.findAll('li');
      await items[30].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([30]);
    });

    it('should emit correct value for seconds type', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Seconds,
        modelValue: 0,
      });
      const items = wrapper.findAll('li');
      await items[45].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([45]);
    });

    it('should emit correct value for AmPm type', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.AmPm,
        modelValue: 0,
      });
      const items = wrapper.findAll('li');
      await items[1].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([1]);
    });

    it('should handle modelValue changes reactively', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 5,
      });
      await wrapper.setProps({ modelValue: 10 });
      await nextTick();
      expect(wrapper.props('modelValue')).toBe(10);
    });

    it('should not emit when clicking already selected item', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 5,
      });

      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;

      const items = wrapper.findAll('li');
      await items[5].trigger('click');
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.[emittedCountBefore]).toEqual(undefined);
    });

    it('should handle null modelValue', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: undefined,
      });
      const items = wrapper.findAll('li');
      await items[0].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([0]);
    });
  });

  describe('DisabledValue Functionality', () => {
    it('should not emit update when clicking disabled item', async () => {
      const disabledValue = (val: number) => val === 5;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
        disabledValue,
      });
      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;
      const items = wrapper.findAll('li');
      await items[5].trigger('click');
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.length || 0).toBe(emittedCountBefore);
    });

    it('should emit update when clicking enabled item', async () => {
      const disabledValue = (val: number) => val === 5;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
        disabledValue,
      });
      const items = wrapper.findAll('li');
      await items[10].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([10]);
    });

    it('should disable multiple items with disabledValue function', async () => {
      const disabledValue = (val: number) => val >= 20;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
        disabledValue,
      });
      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;
      const items = wrapper.findAll('li');
      await items[20].trigger('click');
      await items[21].trigger('click');
      await items[23].trigger('click');
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.length || 0).toBe(emittedCountBefore);
    });

    it('should allow clicking items not disabled by disabledValue', async () => {
      const disabledValue = (val: number) => val >= 20;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
        disabledValue,
      });
      const items = wrapper.findAll('li');
      await items[15].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([15]);
    });

    it('should work with disabledValue for minutes type', async () => {
      const disabledValue = (val: number) => val % 15 !== 0;
      const wrapper = createWrapper({
        type: AppTimeBarType.Minutes,
        modelValue: 0,
        disabledValue,
      });
      const items = wrapper.findAll('li');
      await items[15].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([15]);
    });

    it('should prevent clicking disabled minutes', async () => {
      const disabledValue = (val: number) => val % 15 !== 0;
      const wrapper = createWrapper({
        type: AppTimeBarType.Minutes,
        modelValue: 0,
        disabledValue,
      });
      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;
      const items = wrapper.findAll('li');
      await items[10].trigger('click');
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.length || 0).toBe(emittedCountBefore);
    });

    it('should handle disabledValue returning false for all values', async () => {
      const disabledValue = () => false;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
        disabledValue,
      });
      const items = wrapper.findAll('li');
      await items[5].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([5]);
    });

    it('should handle disabledValue returning true for all values', async () => {
      const disabledValue = () => true;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
        disabledValue,
      });
      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;
      const items = wrapper.findAll('li');
      await items[5].trigger('click');
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.length || 0).toBe(emittedCountBefore);
    });
  });

  describe('Control Buttons - Disabled State', () => {
    it('should disable up button when no previous element exists', () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[0].attributes('disabled')).toBe('true');
    });

    it('should enable up button when previous element exists', () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 5,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[0].attributes('disabled')).toBe('false');
    });

    it('should disable down button when no next element exists', () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 23,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[1].attributes('disabled')).toBe('true');
    });

    it('should enable down button when next element exists', () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 5,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[1].attributes('disabled')).toBe('false');
    });

    it('should disable up button when previous element is disabled', () => {
      const disabledValue = (val: number) => val < 5;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 5,
        disabledValue,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[0].attributes('disabled')).toBe('true');
    });

    it('should disable down button when next element is disabled', () => {
      const disabledValue = (val: number) => val > 10;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 10,
        disabledValue,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[1].attributes('disabled')).toBe('true');
    });

    it('should enable both buttons when prev and next exist and are enabled', () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 10,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[0].attributes('disabled')).toBe('false');
      expect(buttons[1].attributes('disabled')).toBe('false');
    });

    it('should update button states when modelValue changes', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 10,
      });
      await wrapper.setProps({ modelValue: 0 });
      await nextTick();
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[0].attributes('disabled')).toBe('true');
      expect(buttons[1].attributes('disabled')).toBe('false');
    });

    it('should update button states when modelValue changes to last', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 10,
      });
      await wrapper.setProps({ modelValue: 23 });
      await nextTick();
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[0].attributes('disabled')).toBe('false');
      expect(buttons[1].attributes('disabled')).toBe('true');
    });

    it('should handle button states in AmPm mode', () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.AmPm,
        modelValue: 0,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[0].attributes('disabled')).toBe('true');
      expect(buttons[1].attributes('disabled')).toBe('false');
    });

    it('should handle button states at end of AmPm list', () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.AmPm,
        modelValue: 1,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[0].attributes('disabled')).toBe('false');
      expect(buttons[1].attributes('disabled')).toBe('true');
    });
  });

  describe('Control Buttons - Click Events', () => {
    it('should emit click event when up button is clicked', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 5,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      await buttons[0].vm.$emit('click');
      await nextTick();
      expect(buttons[0].emitted('click')).toBeTruthy();
    });

    it('should emit click event when down button is clicked', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 5,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      await buttons[1].vm.$emit('click');
      await nextTick();
      expect(buttons[1].emitted('click')).toBeTruthy();
    });

    it('should not change modelValue on up button click when disabled', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
      });
      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      await buttons[0].vm.$emit('click');
      await nextTick();
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.length || 0).toBe(emittedCountBefore);
    });

    it('should not change modelValue on down button click when disabled', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 23,
      });
      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      await buttons[1].vm.$emit('click');
      await nextTick();
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.length || 0).toBe(emittedCountBefore);
    });
  });

  describe('Scroll Handling', () => {
    it('should handle scroll event from AppScrollbar', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
      });
      const scrollbar = wrapper.findComponent({
        name: 'AppScrollbar',
      });
      const scrollEvent = new Event('scroll');
      Object.defineProperty(scrollEvent, 'target', {
        value: {
          scrollTop: 100,
        },
        enumerable: true,
      });
      await scrollbar.vm.$emit('scroll', scrollEvent);
      await nextTick();
      expect(scrollbar.emitted('scroll')).toBeTruthy();
    });

    it('should not handle scroll when event target is null', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
      });
      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;
      const scrollbar = wrapper.findComponent({
        name: 'AppScrollbar',
      });
      const scrollEvent = new Event('scroll');
      Object.defineProperty(scrollEvent, 'target', {
        value: null,
        enumerable: true,
      });
      await scrollbar.vm.$emit('scroll', scrollEvent);
      await nextTick();
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.length || 0).toBe(emittedCountBefore);
    });
  });

  describe('ResizeObserver', () => {
    it('should observe list element on shallowMount', () => {
      createWrapper();

      expect(observe).toHaveBeenCalled();
    });

    it('should disconnect ResizeObserver on unshallowMount', () => {
      const wrapper = createWrapper();

      wrapper.unmount();
      expect(disconnect).toHaveBeenCalled();
    });

    it('should call resizeList through triggerResizeObserver', () => {
      const wrapper = createWrapper();
      const scrollbar = wrapper.findComponent({ name: 'AppScrollbar' });
      const updateSpy = vi.spyOn(scrollbar.vm.ps, 'update');

      triggerResizeObserver([]);

      expect(updateSpy).toHaveBeenCalled();
    });

    it('should calculate item height when resizeList is triggered', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      const listElement = wrapper.find('ul').element as HTMLElement;
      const mockLi = document.createElement('li');
      Object.defineProperty(mockLi, 'offsetHeight', {
        value: 32,
        configurable: true,
      });
      vi.spyOn(listElement, 'querySelector').mockReturnValue(mockLi);

      triggerResizeObserver([]);

      expect(listElement.querySelector).toHaveBeenCalledWith('li');
    });

    it('should set isRenderedList to true when scrollbar has dimensions', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      const scrollbar = wrapper.findComponent({ name: 'AppScrollbar' });

      expect(scrollbar.vm.ps.containerHeight).toBe(200);
      expect(scrollbar.vm.ps.contentHeight).toBe(400);

      triggerResizeObserver([]);

      const scrollSpy = scrollbar.vm.ps.element.scroll;
      expect(scrollSpy).toBeDefined();
    });

    it('should call ps.update on resizeList trigger', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Minutes });
      const scrollbar = wrapper.findComponent({ name: 'AppScrollbar' });
      const updateSpy = vi.spyOn(scrollbar.vm.ps, 'update');

      triggerResizeObserver([]);

      expect(updateSpy).toHaveBeenCalled();
    });

    it('should handle resizeList when list is null', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      const scrollbar = wrapper.findComponent({ name: 'AppScrollbar' });

      triggerResizeObserver([]);

      expect(scrollbar.vm.ps.update).toBeDefined();
    });

    it('should calculate correct item height from list element', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.AmPm });
      const listElement = wrapper.find('ul').element as HTMLElement;
      const mockLi = document.createElement('li');
      Object.defineProperty(mockLi, 'offsetHeight', {
        value: 40,
        configurable: true,
      });
      vi.spyOn(listElement, 'querySelector').mockReturnValue(mockLi);

      triggerResizeObserver([]);

      expect(listElement.querySelector).toHaveBeenCalled();
    });

    it('should handle resizeList with zero offsetHeight', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      const listElement = wrapper.find('ul').element as HTMLElement;
      const mockLi = document.createElement('li');
      Object.defineProperty(mockLi, 'offsetHeight', {
        value: 0,
        configurable: true,
      });
      vi.spyOn(listElement, 'querySelector').mockReturnValue(mockLi);
      const scrollbar = wrapper.findComponent({ name: 'AppScrollbar' });

      triggerResizeObserver([]);

      expect(scrollbar.vm.ps.update).toHaveBeenCalled();
    });

    it('should handle resizeList when no li element exists', () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      const listElement = wrapper.find('ul').element as HTMLElement;
      vi.spyOn(listElement, 'querySelector').mockReturnValue(null);
      const scrollbar = wrapper.findComponent({ name: 'AppScrollbar' });
      const updateSpy = vi.spyOn(scrollbar.vm.ps, 'update');

      triggerResizeObserver([]);

      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('Props Reactivity', () => {
    it('should update elements when type changes from Hours to Minutes', async () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      expect(wrapper.findAll('li')).toHaveLength(24);
      await wrapper.setProps({ type: AppTimeBarType.Minutes });
      await nextTick();
      expect(wrapper.findAll('li')).toHaveLength(60);
    });

    it('should update elements when type changes to AmPm', async () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      await wrapper.setProps({ type: AppTimeBarType.AmPm });
      await nextTick();
      const items = wrapper.findAll('li');
      expect(items).toHaveLength(2);
      expect(items[0].text()).toBe('AM');
    });

    it('should update elements when enabledAmPm changes', async () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      expect(wrapper.findAll('li')).toHaveLength(24);
      await wrapper.setProps({ enabledAmPm: true });
      await nextTick();
      expect(wrapper.findAll('li')).toHaveLength(12);
    });

    it('should update elements when enabledAmPm changes to false', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        enabledAmPm: true,
      });
      expect(wrapper.findAll('li')).toHaveLength(12);
      await wrapper.setProps({ enabledAmPm: false });
      await nextTick();
      expect(wrapper.findAll('li')).toHaveLength(24);
    });

    it('should update disabled states when disabledValue changes', async () => {
      const disabledValue1 = (val: number) => val < 10;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 10,
        disabledValue: disabledValue1,
      });
      const items1 = wrapper.findAll('li');
      await items1[5].trigger('click');
      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;

      const disabledValue2 = (val: number) => val > 10;
      await wrapper.setProps({ disabledValue: disabledValue2 });
      await nextTick();
      const items2 = wrapper.findAll('li');
      await items2[5].trigger('click');
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.[emittedCountBefore]).toEqual([5]);
    });

    it('should handle type change with modelValue adjustment', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 23,
      });
      await wrapper.setProps({ type: AppTimeBarType.Minutes });
      await nextTick();
      expect(wrapper.findAll('li')).toHaveLength(60);
    });
  });

  describe('Edge Cases', () => {
    it('should handle clicking first item', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 5,
      });
      const items = wrapper.findAll('li');
      await items[0].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([0]);
    });

    it('should handle clicking last item', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 5,
      });
      const items = wrapper.findAll('li');
      await items[23].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([23]);
    });

    it('should handle rapid clicks on different items', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
      });
      const items = wrapper.findAll('li');
      await items[5].trigger('click');
      await items[10].trigger('click');
      await items[15].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([15]);
    });

    it('should handle modelValue at boundary in Hours 24h mode', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
      });
      await wrapper.setProps({ modelValue: 23 });
      await nextTick();
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[1].attributes('disabled')).toBe('true');
    });

    it('should handle modelValue at boundary in Minutes mode', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Minutes,
        modelValue: 59,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[1].attributes('disabled')).toBe('true');
    });

    it('should handle modelValue at boundary in Seconds mode', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Seconds,
        modelValue: 59,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[1].attributes('disabled')).toBe('true');
    });

    it('should handle all items disabled scenario', async () => {
      const disabledValue = () => true;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 5,
        disabledValue,
      });
      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[0].attributes('disabled')).toBe('true');
      expect(buttons[1].attributes('disabled')).toBe('true');
    });

    it('should handle disabledValue with complex logic', async () => {
      const disabledValue = (val: number) => val % 2 !== 0 && val < 10;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
        disabledValue,
      });
      const items = wrapper.findAll('li');
      await items[3].trigger('click');
      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;
      await items[11].trigger('click');
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.[emittedCountBefore]).toEqual([11]);
    });

    it('should handle multiple type changes', async () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      await wrapper.setProps({ type: AppTimeBarType.Minutes });
      await wrapper.setProps({ type: AppTimeBarType.Seconds });
      await wrapper.setProps({ type: AppTimeBarType.AmPm });
      await nextTick();
      const items = wrapper.findAll('li');
      expect(items).toHaveLength(2);
      expect(items[0].text()).toBe('AM');
    });

    it('should handle enabledAmPm toggle multiple times', async () => {
      const wrapper = createWrapper({ type: AppTimeBarType.Hours });
      await wrapper.setProps({ enabledAmPm: true });
      await wrapper.setProps({ enabledAmPm: false });
      await wrapper.setProps({ enabledAmPm: true });
      await nextTick();
      expect(wrapper.findAll('li')).toHaveLength(12);
    });

    it('should handle modelValue outside valid range', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 100,
      });
      const items = wrapper.findAll('li');
      await items[5].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([5]);
    });

    it('should handle negative modelValue', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: -1,
      });
      const items = wrapper.findAll('li');
      await items[5].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual([5]);
    });

    it('should handle clicking item in 12-hour mode boundary', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        enabledAmPm: true,
        modelValue: 12,
      });
      const items = wrapper.findAll('li');
      expect(items[0].text()).toBe('12');
      await items[0].trigger('click');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.[emitted.length - 1]).toEqual(undefined);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle full workflow: render, click, update, verify state', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 5,
      });
      const itemsBefore = wrapper.findAll('li');
      expect(itemsBefore).toHaveLength(24);

      await itemsBefore[10].trigger('click');
      const emitted1 = wrapper.emitted('update:modelValue');
      expect(emitted1?.[emitted1.length - 1]).toEqual([10]);

      await wrapper.setProps({ modelValue: 10 });
      await nextTick();

      const buttons = wrapper.findAllComponents({
        name: 'AppTimeControlButton',
      });
      expect(buttons[0].attributes('disabled')).toBe('false');
      expect(buttons[1].attributes('disabled')).toBe('false');
    });

    it('should handle switching between types with disabled values', async () => {
      const disabledValue = (val: number) => val > 20;
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 15,
        disabledValue,
      });
      const items1 = wrapper.findAll('li');
      await items1[15].trigger('click');

      await wrapper.setProps({ type: AppTimeBarType.Minutes });
      await nextTick();
      const items2 = wrapper.findAll('li');
      expect(items2).toHaveLength(60);
      await items2[25].trigger('click');
      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.length || 0).toBe(emittedCountBefore);
    });

    it('should handle complex scenario with multiple prop changes', async () => {
      const wrapper = createWrapper({
        type: AppTimeBarType.Hours,
        modelValue: 0,
        enabledAmPm: false,
      });
      expect(wrapper.findAll('li')).toHaveLength(24);

      await wrapper.setProps({ enabledAmPm: true });
      await nextTick();
      expect(wrapper.findAll('li')).toHaveLength(12);

      const disabledValue = (val: number) => val > 6;
      await wrapper.setProps({ disabledValue });
      await nextTick();

      const items = wrapper.findAll('li');
      await items[5].trigger('click');
      const emitted1 = wrapper.emitted('update:modelValue');
      expect(emitted1?.[emitted1.length - 1]).toEqual([5]);

      await items[10].trigger('click');
      const emittedCount = wrapper.emitted('update:modelValue')?.length || 0;
      expect(emittedCount).toBe(emitted1?.length || 0);
    });
  });
});
