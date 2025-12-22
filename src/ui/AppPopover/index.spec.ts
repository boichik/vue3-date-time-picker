import { shallowMount } from '@vue/test-utils';
import AppPopover from './Index.vue';
import { nextTick } from 'vue';
import { AppDateTimePopoverInternalSettingsProvide } from '@/const/globalProvide.const';

const { destroyMock, updateMock, createPopperMock } = vi.hoisted(() => {
  const destroy = vi.fn();
  const update = vi.fn();

  const createPopper = vi.fn(() => ({
    destroy,
    update,
  }));

  return {
    destroyMock: destroy,
    updateMock: update,
    createPopperMock: createPopper,
  };
});

vi.mock('@popperjs/core', () => ({
  createPopper: createPopperMock,
}));

vi.mock('vue', async importActual => {
  const actual = (await importActual()) as typeof import('vue');
  return {
    ...actual,
    useId: vi.fn(() => 'unique-id'),
  };
});

describe('AppPopover', () => {
  const createWrapper = (
    props?: Partial<InstanceType<typeof AppPopover>['$props']>,
    forceUpdate?: boolean
  ) => {
    return shallowMount(AppPopover, {
      props: {
        modelValue: false,
        ...props,
      },
      global: {
        stubs: {
          'client-only': {
            template: '<div><slot /></div>',
            name: 'ClientOnly',
          },
          Teleport: {
            template: '<div><slot /></div>',
            name: 'Teleport',
            props: ['to', 'disabled'],
          },
        },
        provide: {
          [AppDateTimePopoverInternalSettingsProvide]: { forceUpdate },
        },
      },
      slots: {
        reference: '<button>Reference</button>',
        content: '<p>Popover Content</p>',
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render reference and popover content', () => {
    const wrapper = createWrapper();

    const reference = wrapper.find({ ref: 'reference' });
    const content = wrapper.find({ ref: 'content' });

    expect(reference.exists()).toBe(true);
    expect(reference.attributes('id')).toBe('unique-id');
    expect(reference.attributes('tabindex')).toBe('0');

    expect(reference.html()).toContain('Reference');

    expect(content.exists()).toBe(true);
    expect(content.html()).toContain('Popover Content');
  });

  it('content must have correct styles', () => {
    const wrapper = createWrapper();

    const content = wrapper.find({ ref: 'content' });

    expect(content.exists()).toBe(true);
    expect(content.attributes('style')).toContain('z-index: 1000;');
  });

  it('teleport component must have correct props', () => {
    const wrapper = createWrapper();

    const teleport = wrapper.findComponent({ name: 'Teleport' });

    expect(teleport.exists()).toBe(true);
    expect(teleport.props('to')).toBe('body');
    expect(teleport.props('disabled')).toBe(true);
  });

  it('teleport component must be disabled when "appendToBody" prop is false', () => {
    const wrapper = createWrapper({ appendToBody: true });

    const teleport = wrapper.findComponent({ name: 'Teleport' });

    expect(teleport.exists()).toBe(true);
    expect(teleport.props('to')).toBe('body');
    expect(teleport.props('disabled')).toBe(false);
  });

  it('teleport component must be assigned to a custom element when "customAppend" prop is set', () => {
    const wrapper = createWrapper({ customAppend: '#custom-element' });

    const teleport = wrapper.findComponent({ name: 'Teleport' });

    expect(teleport.exists()).toBe(true);
    expect(teleport.props('to')).toBe('#custom-element');
    expect(teleport.props('disabled')).toBe(true);
  });

  it('should be displayed client-only when "clientOnlyPopoverContent" prop is true', () => {
    const wrapper = createWrapper({ clientOnlyPopoverContent: true });

    const clientOnly = wrapper.findComponent({ name: 'ClientOnly' });

    expect(clientOnly.exists()).toBe(true);
  });

  it.each([
    undefined,
    {},
    { modelValue: false },
    { disabled: true },
    { modelValue: false, disabled: true },
  ])('popover content should not be displayed', props => {
    const wrapper = createWrapper(props);

    const content = wrapper.find({ ref: 'content' });

    expect(content.isVisible()).toBe(false);
  });

  it('should initialize popper with correct options based on props', async () => {
    const wrapper = createWrapper();

    await nextTick();

    const referenceElement = wrapper.find({ ref: 'reference' }).element;
    const contentElement = wrapper.find({ ref: 'content' }).element;

    expect(createPopperMock).toHaveBeenCalledWith(
      referenceElement,
      contentElement,
      expect.objectContaining({
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 12],
            },
          },
        ],
      })
    );
  });

  it('should show popover with delay when modelValue changes to true', async () => {
    const openDelay = 100;
    const wrapper = createWrapper({ modelValue: false, openDelay });

    await wrapper.setProps({ modelValue: true });

    expect(wrapper.find({ ref: 'content' }).isVisible()).toBe(false);

    vi.advanceTimersByTime(openDelay);
    await nextTick();

    expect(wrapper.find({ ref: 'content' }).isVisible()).toBe(true);
    expect(wrapper.emitted('open')).toBeTruthy();

    expect(updateMock).toHaveBeenCalled();
  });

  it('should hide popover with delay when modelValue changes to false', async () => {
    const closeDelay = 200;
    const wrapper = createWrapper({ modelValue: true, closeDelay });

    expect(wrapper.find({ ref: 'content' }).isVisible()).toBe(true);

    await wrapper.setProps({ modelValue: false });

    vi.advanceTimersByTime(closeDelay);
    await nextTick();

    expect(wrapper.find({ ref: 'content' }).isVisible()).toBe(false);
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('should not hide the pop-up window with a delay when modelValue changes to false and disabled true', async () => {
    const closeDelay = 200;
    const wrapper = createWrapper({
      modelValue: true,
      closeDelay,
    });

    expect(wrapper.find({ ref: 'content' }).isVisible()).toBe(true);

    await wrapper.setProps({ modelValue: false, disabled: true });

    vi.advanceTimersByTime(closeDelay);
    await nextTick();

    expect(wrapper.find({ ref: 'content' }).isVisible()).toBe(true);
    expect(wrapper.emitted('close')).toBeFalsy();
  });

  it('should NOT show popover if disabled prop is true', async () => {
    const wrapper = createWrapper({
      modelValue: false,
      disabled: true,
      openDelay: 0,
    });

    await wrapper.setProps({ modelValue: true });
    vi.advanceTimersByTime(0);

    expect(wrapper.find({ ref: 'content' }).isVisible()).toBe(false);
    expect(wrapper.emitted('open')).toBeFalsy();
  });

  it('should force update popper instance if forceUpdate setting is provided', async () => {
    const wrapper = createWrapper({ modelValue: false }, true);

    updateMock.mockClear();

    await wrapper.setProps({ modelValue: true });

    expect(updateMock).toHaveBeenCalled();
  });

  it('should initialize popper if it was missing when showing', async () => {
    const wrapper = createWrapper({ modelValue: false });

    expect(createPopperMock).toHaveBeenCalledTimes(1);
    createPopperMock.mockClear();

    await wrapper.setProps({ modelValue: true });
    expect(createPopperMock).not.toHaveBeenCalled();
  });

  it('should destroy popper instance on unmount', () => {
    const wrapper = createWrapper();

    wrapper.unmount();

    expect(destroyMock).toHaveBeenCalled();
  });
});
