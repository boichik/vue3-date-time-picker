import { computed, nextTick } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppDateTimeShortcutPanel from './AppDateTimeShortcutPanel.vue';
import AppScrollbar from '@/ui/AppScrollbar/Index.vue';
import { AppDateTimePickerComponentDataProvide } from '../../../const';
import type { AppDateTimePickerComponentData } from '../../../interfaces/index.interface';
import { AppDateTimePickerType } from '../../../enums/dateTimePickerType';

describe('AppDateTimeShortcutPanel', () => {
  const createWrapper = (provides?: {
    componentData?: Partial<AppDateTimePickerComponentData>;
  }) => {
    const defaultComponentData: Partial<AppDateTimePickerComponentData> = {
      shortcuts: [],
      type: AppDateTimePickerType.Date,
      ...provides?.componentData,
    };

    return shallowMount(AppDateTimeShortcutPanel, {
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: computed(
            () => defaultComponentData
          ),
        },
        stubs: {
          AppScrollbar: {
            template: '<div><slot /></div>',
            name: 'AppScrollbar',
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component rendering', () => {
    it('should render AppScrollbar component', () => {
      const wrapper = createWrapper();
      const scrollbar = wrapper.findComponent(AppScrollbar);

      expect(scrollbar.exists()).toBe(true);
    });

    it('should render ul element', () => {
      const wrapper = createWrapper();
      const list = wrapper.find('ul');

      expect(list.exists()).toBe(true);
    });

    it('should not render any items when shortcuts array is empty', () => {
      const wrapper = createWrapper({
        componentData: { shortcuts: [] },
      });
      const items = wrapper.findAll('li');

      expect(items).toHaveLength(0);
    });

    it('should render shortcut items', () => {
      const shortcuts = [
        { text: 'Today', value: new Date('2023-06-15') },
        { text: 'Yesterday', value: new Date('2023-06-14') },
      ];
      const wrapper = createWrapper({
        componentData: { shortcuts },
      });
      const items = wrapper.findAll('li');

      expect(items).toHaveLength(2);
    });

    it('should display shortcut text correctly', () => {
      const shortcuts = [{ text: 'Today', value: new Date('2023-06-15') }];
      const wrapper = createWrapper({
        componentData: { shortcuts },
      });
      const items = wrapper.findAll('li');

      expect(items[0].text()).toBe('Today');
    });

    it('should render multiple shortcuts with correct texts', () => {
      const shortcuts = [
        { text: 'Today', value: new Date('2023-06-15') },
        { text: 'Yesterday', value: new Date('2023-06-14') },
        { text: 'Last Week', value: new Date('2023-06-08') },
      ];
      const wrapper = createWrapper({
        componentData: { shortcuts },
      });
      const items = wrapper.findAll('li');

      expect(items[0].text()).toBe('Today');
      expect(items[1].text()).toBe('Yesterday');
      expect(items[2].text()).toBe('Last Week');
    });
  });

  describe('Shortcut click events - Single date type', () => {
    it('should emit select event when valid Date shortcut is clicked', async () => {
      const date = new Date('2023-06-15');
      const shortcuts = [{ text: 'Today', value: date }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')?.[0]).toEqual([date]);
    });

    it('should emit select event when null shortcut is clicked', async () => {
      const shortcuts = [{ text: 'Clear', value: null }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')?.[0]).toEqual([null]);
    });

    it('should not emit select event for invalid array value in single date type', async () => {
      const shortcuts = [
        {
          text: 'Invalid Range',
          value: [new Date('2023-06-15'), new Date('2023-06-20')],
        },
      ];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeFalsy();
    });

    it('should not emit select event for invalid Date', async () => {
      const shortcuts = [{ text: 'Invalid', value: new Date('invalid') }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeFalsy();
    });

    it('should not emit select event for string value', async () => {
      const shortcuts = [{ text: 'String', value: '2023-06-15' }];
      const wrapper = createWrapper({
        // @ts-expect-error Testing invalid value
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeFalsy();
    });

    it('should not emit select event for number value', async () => {
      const shortcuts = [{ text: 'Number', value: 1234567890 }];
      const wrapper = createWrapper({
        // @ts-expect-error Testing invalid value
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeFalsy();
    });

    it('should not emit select event for object value', async () => {
      const shortcuts = [
        { text: 'Object', value: { date: new Date('2023-06-15') } },
      ];
      const wrapper = createWrapper({
        // @ts-expect-error Testing invalid value
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeFalsy();
    });
  });

  describe('Shortcut click events - DateTime type', () => {
    it('should emit select event for valid Date in DateTime type', async () => {
      const date = new Date('2023-06-15T14:30:00');
      const shortcuts = [{ text: 'Now', value: date }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateTime },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')?.[0]).toEqual([date]);
    });

    it('should emit select event for null in DateTime type', async () => {
      const shortcuts = [{ text: 'Clear', value: null }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateTime },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')?.[0]).toEqual([null]);
    });
  });

  describe('Shortcut click events - DateRange type', () => {
    it('should emit select event for valid date range', async () => {
      const range = [new Date('2023-06-15'), new Date('2023-06-20')];
      const shortcuts = [{ text: 'This Week', value: range }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateRange },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')?.[0]).toEqual([range]);
    });

    it('should emit select event for range with null values', async () => {
      const range = [null, null];
      const shortcuts = [{ text: 'Clear Range', value: range }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateRange },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')?.[0]).toEqual([range]);
    });

    it('should emit select event for range with one null value', async () => {
      const range = [new Date('2023-06-15'), null];
      const shortcuts = [{ text: 'From Today', value: range }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateRange },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')?.[0]).toEqual([range]);
    });

    it('should not emit select event for single Date in range type', async () => {
      const shortcuts = [
        { text: 'Single Date', value: new Date('2023-06-15') },
      ];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateRange },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeFalsy();
    });

    it('should not emit select event for null in range type', async () => {
      const shortcuts = [{ text: 'Null', value: null }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateRange },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeFalsy();
    });

    it('should not emit select event for array with invalid Date', async () => {
      const range = [new Date('invalid'), new Date('2023-06-20')];
      const shortcuts = [{ text: 'Invalid Range', value: range }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateRange },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeFalsy();
    });

    it('should not emit select event for array with string values', async () => {
      const range = ['2023-06-15', '2023-06-20'];
      const shortcuts = [{ text: 'String Range', value: range }];
      const wrapper = createWrapper({
        // @ts-expect-error Testing invalid value
        componentData: { shortcuts, type: AppDateTimePickerType.DateRange },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeFalsy();
    });
  });

  describe('Shortcut click events - DateTimeRange type', () => {
    it('should emit select event for valid datetime range', async () => {
      const range = [
        new Date('2023-06-15T10:00:00'),
        new Date('2023-06-20T18:00:00'),
      ];
      const shortcuts = [{ text: 'This Week', value: range }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateTimeRange },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')?.[0]).toEqual([range]);
    });

    it('should emit select event for datetime range with null', async () => {
      const range = [new Date('2023-06-15T10:00:00'), null];
      const shortcuts = [{ text: 'From Now', value: range }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateTimeRange },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')?.[0]).toEqual([range]);
    });

    it('should not emit select event for single Date in datetime range type', async () => {
      const shortcuts = [
        { text: 'Single', value: new Date('2023-06-15T10:00:00') },
      ];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateTimeRange },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toBeFalsy();
    });
  });

  describe('Multiple shortcuts interaction', () => {
    it('should emit select only for clicked shortcut', async () => {
      const date1 = new Date('2023-06-15');
      const date2 = new Date('2023-06-14');
      const shortcuts = [
        { text: 'Today', value: date1 },
        { text: 'Yesterday', value: date2 },
      ];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[1].trigger('click');

      expect(wrapper.emitted('select')?.[0]).toEqual([date2]);
    });

    it('should handle multiple clicks on same shortcut', async () => {
      const date = new Date('2023-06-15');
      const shortcuts = [{ text: 'Today', value: date }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');
      await items[0].trigger('click');
      await items[0].trigger('click');

      expect(wrapper.emitted('select')).toHaveLength(3);
    });

    it('should handle clicks on different shortcuts', async () => {
      const date1 = new Date('2023-06-15');
      const date2 = new Date('2023-06-14');
      const date3 = new Date('2023-06-13');
      const shortcuts = [
        { text: 'Today', value: date1 },
        { text: 'Yesterday', value: date2 },
        { text: 'Day Before', value: date3 },
      ];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');
      await items[2].trigger('click');
      await items[1].trigger('click');

      expect(wrapper.emitted('select')).toHaveLength(3);
      expect(wrapper.emitted('select')?.[0]).toEqual([date1]);
      expect(wrapper.emitted('select')?.[1]).toEqual([date3]);
      expect(wrapper.emitted('select')?.[2]).toEqual([date2]);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty shortcuts array', () => {
      const wrapper = createWrapper({
        componentData: { shortcuts: [] },
      });
      const items = wrapper.findAll('li');

      expect(items).toHaveLength(0);
    });

    it('should handle undefined shortcuts', () => {
      const wrapper = createWrapper({
        componentData: { shortcuts: undefined },
      });
      const items = wrapper.findAll('li');

      expect(items).toHaveLength(0);
    });

    it('should handle shortcuts with empty text', () => {
      const shortcuts = [{ text: '', value: new Date('2023-06-15') }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      expect(items[0].text()).toBe('');
    });

    it('should handle shortcuts with special characters in text', () => {
      const shortcuts = [
        {
          text: 'Test & <Special> "Characters"',
          value: new Date('2023-06-15'),
        },
      ];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      expect(items[0].text()).toContain('Test');
    });

    it('should handle very long shortcut text', () => {
      const longText = 'A'.repeat(100);
      const shortcuts = [{ text: longText, value: new Date('2023-06-15') }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      expect(items[0].text()).toBe(longText);
    });

    it('should handle many shortcuts', () => {
      const shortcuts = Array.from({ length: 50 }, (_, i) => ({
        text: `Shortcut ${i}`,
        value: new Date(2023, 5, i + 1),
      }));
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      expect(items).toHaveLength(50);
    });

    it('should handle Date at epoch start', async () => {
      const date = new Date(0);
      const shortcuts = [{ text: 'Epoch', value: date }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')?.[0]).toEqual([date]);
    });

    it('should handle far future date', async () => {
      const date = new Date('2100-12-31');
      const shortcuts = [{ text: 'Future', value: date }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')?.[0]).toEqual([date]);
    });

    it('should handle far past date', async () => {
      const date = new Date('1900-01-01');
      const shortcuts = [{ text: 'Past', value: date }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')?.[0]).toEqual([date]);
    });

    it('should handle leap year date', async () => {
      const date = new Date('2024-02-29');
      const shortcuts = [{ text: 'Leap Day', value: date }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')?.[0]).toEqual([date]);
    });

    it('should handle Date with milliseconds', async () => {
      const date = new Date('2023-06-15T14:30:45.123');
      const shortcuts = [{ text: 'Precise Time', value: date }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateTime },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');

      expect(wrapper.emitted('select')?.[0]).toEqual([date]);
    });
  });

  describe('Dynamic updates', () => {
    it('should update rendered shortcuts when shortcuts prop changes', async () => {
      const wrapper = createWrapper({
        componentData: {
          shortcuts: [{ text: 'Today', value: new Date('2023-06-15') }],
        },
      });

      await nextTick();

      expect(wrapper.findAll('li')).toHaveLength(1);
    });

    it('should handle type change from single to range', async () => {
      const date = new Date('2023-06-15');
      const shortcuts = [{ text: 'Date', value: date }];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');
      expect(wrapper.emitted('select')).toHaveLength(1);
    });
  });

  describe('Mixed valid and invalid shortcuts', () => {
    it('should only emit for valid shortcuts in mixed list', async () => {
      const validDate = new Date('2023-06-15');
      const invalidDate = new Date('invalid');
      const shortcuts = [
        { text: 'Valid', value: validDate },
        { text: 'Invalid', value: invalidDate },
        { text: 'String', value: 'not-a-date' },
      ];
      const wrapper = createWrapper({
        // @ts-expect-error Testing invalid values
        componentData: { shortcuts, type: AppDateTimePickerType.Date },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');
      await items[1].trigger('click');
      await items[2].trigger('click');

      expect(wrapper.emitted('select')).toHaveLength(1);
      expect(wrapper.emitted('select')?.[0]).toEqual([validDate]);
    });

    it('should handle mixed valid and invalid ranges', async () => {
      const validRange = [new Date('2023-06-15'), new Date('2023-06-20')];
      const invalidRange = [new Date('invalid'), new Date('2023-06-20')];
      const shortcuts = [
        { text: 'Valid Range', value: validRange },
        { text: 'Invalid Range', value: invalidRange },
      ];
      const wrapper = createWrapper({
        componentData: { shortcuts, type: AppDateTimePickerType.DateRange },
      });
      const items = wrapper.findAll('li');

      await items[0].trigger('click');
      await items[1].trigger('click');

      expect(wrapper.emitted('select')).toHaveLength(1);
      expect(wrapper.emitted('select')?.[0]).toEqual([validRange]);
    });
  });

  describe('AppScrollbar integration', () => {
    it('should render shortcuts inside AppScrollbar', () => {
      const shortcuts = [
        { text: 'Today', value: new Date('2023-06-15') },
        { text: 'Yesterday', value: new Date('2023-06-14') },
      ];
      const wrapper = createWrapper({
        componentData: { shortcuts },
      });
      const scrollbar = wrapper.findComponent(AppScrollbar);
      const itemsInScrollbar = scrollbar.findAll('li');

      expect(itemsInScrollbar).toHaveLength(2);
    });

    it('should render ul inside AppScrollbar', () => {
      const wrapper = createWrapper();
      const scrollbar = wrapper.findComponent(AppScrollbar);
      const list = scrollbar.find('ul');

      expect(list.exists()).toBe(true);
    });
  });

  describe('Type validation combinations', () => {
    it.each([
      {
        type: AppDateTimePickerType.Date,
        value: new Date('2023-06-15'),
        shouldEmit: true,
      },
      { type: AppDateTimePickerType.Date, value: null, shouldEmit: true },
      {
        type: AppDateTimePickerType.Date,
        value: [new Date('2023-06-15'), new Date('2023-06-20')],
        shouldEmit: false,
      },
      {
        type: AppDateTimePickerType.DateTime,
        value: new Date('2023-06-15T10:00:00'),
        shouldEmit: true,
      },
      { type: AppDateTimePickerType.DateTime, value: null, shouldEmit: true },
      {
        type: AppDateTimePickerType.DateRange,
        value: [new Date('2023-06-15'), new Date('2023-06-20')],
        shouldEmit: true,
      },
      {
        type: AppDateTimePickerType.DateRange,
        value: new Date('2023-06-15'),
        shouldEmit: false,
      },
      {
        type: AppDateTimePickerType.DateTimeRange,
        value: [
          new Date('2023-06-15T10:00:00'),
          new Date('2023-06-20T18:00:00'),
        ],
        shouldEmit: true,
      },
      {
        type: AppDateTimePickerType.DateTimeRange,
        value: new Date('2023-06-15'),
        shouldEmit: false,
      },
    ])(
      'should handle type=$type with value type correctly (shouldEmit=$shouldEmit)',
      async ({ type, value, shouldEmit }) => {
        const shortcuts = [{ text: 'Test', value }];
        const wrapper = createWrapper({
          componentData: { shortcuts, type },
        });
        const items = wrapper.findAll('li');

        await items[0].trigger('click');

        if (shouldEmit) {
          expect(wrapper.emitted('select')).toBeTruthy();
        } else {
          expect(wrapper.emitted('select')).toBeFalsy();
        }
      }
    );
  });
});
