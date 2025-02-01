import { mount } from '@vue/test-utils';
import AppScrollbar from '@/ui/AppScrollbar.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

vi.mock('vue3-perfect-scrollbar', () => ({
  PerfectScrollbar: {
    template: '<div><slot /></div>',
  },
}));

describe('AppScrollbar', () => {
  it('renders the default slot content', () => {
    const wrapper = mount(AppScrollbar, {
      slots: {
        default: '<p>Content inside scrollbar</p>',
      },
    });

    expect(wrapper.find('.app-scrollbar__content').html()).toContain(
      '<p>Content inside scrollbar</p>'
    );
  });

  it('applies the correct class when `showVerticalScroll` is false', () => {
    const wrapper = mount(AppScrollbar, {
      props: {
        showVerticalScroll: false,
      },
    });

    expect(wrapper.find('.app-scrollbar').classes()).toContain(
      'app-scrollbar--hide-y'
    );
  });

  it('does not apply the `app-scrollbar--hide-y` class when `showVerticalScroll` is true', () => {
    const wrapper = mount(AppScrollbar, {
      props: {
        showVerticalScroll: true,
      },
    });

    expect(wrapper.find('.app-scrollbar').classes()).not.toContain(
      'app-scrollbar--hide-y'
    );
  });

  it('emits "scroll" event on PerfectScrollbar scroll', async () => {
    const wrapper = mount(AppScrollbar);

    await wrapper.findComponent(PerfectScrollbar).trigger('scroll');
    expect(wrapper.emitted().scroll).toBeTruthy();
  });

  it('emits "scroll-y" event on ps-scroll-y', async () => {
    const wrapper = mount(AppScrollbar);

    await wrapper.findComponent(PerfectScrollbar).trigger('ps-scroll-y');
    expect(wrapper.emitted()['scroll-y']).toBeTruthy();
  });

  it('emits "scroll-x" event on ps-scroll-x', async () => {
    const wrapper = mount(AppScrollbar);

    await wrapper.findComponent(PerfectScrollbar).trigger('ps-scroll-x');
    expect(wrapper.emitted()['scroll-x']).toBeTruthy();
  });

  it('emits "scroll-up" event on ps-scroll-up', async () => {
    const wrapper = mount(AppScrollbar);

    await wrapper.findComponent(PerfectScrollbar).trigger('ps-scroll-up');
    expect(wrapper.emitted()['scroll-up']).toBeTruthy();
  });

  it('emits "scroll-down" event on ps-scroll-down', async () => {
    const wrapper = mount(AppScrollbar);

    await wrapper.findComponent(PerfectScrollbar).trigger('ps-scroll-down');
    expect(wrapper.emitted()['scroll-down']).toBeTruthy();
  });

  it('emits "scroll-left" event on ps-scroll-left', async () => {
    const wrapper = mount(AppScrollbar);

    await wrapper.findComponent(PerfectScrollbar).trigger('ps-scroll-left');
    expect(wrapper.emitted()['scroll-left']).toBeTruthy();
  });

  it('emits "scroll-right" event on ps-scroll-right', async () => {
    const wrapper = mount(AppScrollbar);

    await wrapper.findComponent(PerfectScrollbar).trigger('ps-scroll-right');
    expect(wrapper.emitted()['scroll-right']).toBeTruthy();
  });

  it('emits "y-reach-start" event on ps-y-reach-start', async () => {
    const wrapper = mount(AppScrollbar);

    await wrapper.findComponent(PerfectScrollbar).trigger('ps-y-reach-start');
    expect(wrapper.emitted()['y-reach-start']).toBeTruthy();
  });

  it('emits "y-reach-end" event on ps-y-reach-end', async () => {
    const wrapper = mount(AppScrollbar);

    await wrapper.findComponent(PerfectScrollbar).trigger('ps-y-reach-end');
    expect(wrapper.emitted()['y-reach-end']).toBeTruthy();
  });

  it('emits "x-reach-start" event on ps-x-reach-start', async () => {
    const wrapper = mount(AppScrollbar);

    await wrapper.findComponent(PerfectScrollbar).trigger('ps-x-reach-start');
    expect(wrapper.emitted()['x-reach-start']).toBeTruthy();
  });

  it('emits "x-reach-end" event on ps-x-reach-end', async () => {
    const wrapper = mount(AppScrollbar);

    await wrapper.findComponent(PerfectScrollbar).trigger('ps-x-reach-end');
    expect(wrapper.emitted()['x-reach-end']).toBeTruthy();
  });
});
