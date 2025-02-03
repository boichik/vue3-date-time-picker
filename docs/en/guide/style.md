# Styles

This section is intended to show you how you can style the components to suit your needs.
<br>
For styling, <code>Vue3DateTimePicker</code> uses CSS variables, which allows you to flexibly customise them. The styling is divided into two types: basic and advanced

<p>To apply your changes, you need to connect custom styles after the default ones:</p>

::: tip
If you are customising absolutely all variables, you can refuse to import the file <code>variables.css</code>
:::

```ts
import '@boichikpro/vue3-datetime-picker/assets/styles.css';
import '@boichikpro/vue3-datetime-picker/assets/variables.css';
import '../styles/my-custom-styles.css';
```

## Basic customisation

This type of customisation consists of a small number of css variables that can be used to customise the appearance of components.

```css
:root {
  /* Primary */
  --vpick--color-primary: #3a5ccc;
  --vpick--color-error: #d5393e;
  --vpick--color-info: #dddddd;

  /* Text */
  --vpick--color-text-primary: #2a2f3b;
  --vpick--color-text-regular: #656a78;
  --vpick--color-text-secondary: #c4c4c4;
  --vpick--color-placeholder: #888888;

  /* Borders */
  --vpick--color-border-base: #dddddd;
  --vpick--bolor-border-regular: #cccccc;
  --vpick--color-border-light: #ededed;

  /* Backgrounds */
  --vpick--color-dark: #000000;
  --vpick--color-white: #ffffff;

  /* Font */
  --vpick--font-family: 'Roboto', 'Arial', 'Helvetica', 'Segoe UI', sans-serif;

  --vpick--font-default-font-weight: 400;
  --vpick--font-default-font-size: 14px;
  --vpick--font-default-line-height: 24px;

  --vpick--font-medium-font-weight: 500;
  --vpick--font-medium-font-size: 16px;
  --vpick--font-medium-line-height: 26px;

  /* Common */
  --vpick--animation-delay: 0.3s;
}
```

## Advanced customisation

If you need to customise a particular component, or change the styles of most components in general, you can use more advanced component customisation.
Below are the CSS variables for each component:

### DateTimePicker

```css
:root {
  /* DATE PICKER */
  --vpick--date-time-content-column-gap: 10px;
  --vpick--date-time-content-padding-bottom: 10px;

  --vpick--control-btn-size: 24px;
  --vpick--control-btn-bg-color: unset;
  --vpick--control-hover-btn-bg-color: unset;
  --vpick--control-focus-btn-bg-color: unset;
  --vpick--control-disabled-btn-bg-color: unset;

  --vpick--control-btn-icon-size: 18px;
  --vpick--control-btn-icon-color: var(--vpick--color-text-primary);
  --vpick--control-hover-btn-icon-color: var(--vpick--color-primary);
  --vpick--control-focus-btn-icon-color: var(--vpick--color-primary);
  --vpick--control-disabled-btn-icon-color: var(--vpick--color-text-primary);

  --vpick--panel-center-height: 35px;
  --vpick--panel-center-control-gap: 8px;
  --vpick--panel-center-control-minmax-width: minmax(130px, auto);
  --vpick--panel-center-control-font: var(--vpick--font-medium);
  --vpick--panel-center-control-color: var(--vpick--color-text-primary);
  --vpick--panel-center-control-hover-color: var(--vpick--color-primary);
  --vpick--panel-center-control-focus-color: var(--vpick--color-primary);
  --vpick--panel-center-control-disabled-color: var(
    --vpick--color-text-primary
  );
  --vpick--panel-center-control-text-transform-month: capitalize;
  --vpick--panel-margin-bottom: 4px;

  --vpick--month-table-cell-size: 58px;
  --vpick--month-table-cell-today-left: calc(
    (
        var(--vpick--month-table-cell-size) -
          var(--vpick--table-cell-today-size)
      ) /
      2
  );
  --vpick--month-table-cell-text-transform: capitalize;

  --vpick--year-table-cell-size: 58px;
  --vpick--year-table-cell-today-left: calc(
    (var(--vpick--year-table-cell-size) - var(--vpick--table-cell-today-size)) /
      2
  );

  --vpick--table-range-gap: 10px;

  --vpick--table-cell-gap: 2px;
  --vpick--table-cell-today-size: 4px;
  --vpick--table-cell-today-bottom: var(--vpick--table-cell-today-size);
  --vpick--table-cell-today-color: var(--vpick--color-primary);
  --vpick--table-cell-today-selected-color: var(--vpick--color-white);

  --vpick--day-table-weekdays-margin-bottom: 8px;
  --vpick--day-table-weekdays-color: var(--vpick--color-text-secondary);
  --vpick--day-table-weekdays-bg-color: unset;
  --vpick--day-table-weekdays-text-transform: capitalize;
  --vpick--day-table-cell-size: 35px;
  --vpick--day-table-cell-today-left: calc(
    (var(--vpick--day-table-cell-size) - var(--vpick--table-cell-today-size)) /
      var(--vpick--table-cell-border-width) * 2
  );

  --vpick--day-table-cell-other-month-color: var(
    --vpick--table-cell-disabled-color
  );
  --vpick--day-table-cell-other-month-bg-color: var(
    --vpick--table-cell-disabled-bg-color
  );
  --vpick--day-table-cell-other-month-border-color: var(
    --vpick--table-cell-disabled-border-color
  );

  --vpick--day-table-cell-range-color: var(--vpick--table-cell-hover-color);
  --vpick--day-table-cell-range-bg-color: var(
    --vpick--table-cell-hover-bg-color
  );
  --vpick--day-table-cell-range-border-color: var(
    --vpick--table-cell-hover-bg-color
  );

  --vpick--day-table-cell-range-hover-color: var(
    --vpick--table-cell-hover-color
  );
  --vpick--day-table-cell-range-hover-bg-color: var(
    --vpick--table-cell-hover-bg-color
  );
  --vpick--day-table-cell-range-hover-border-color: var(
    --vpick--table-cell-hover-bg-color
  );

  --vpick--table-cell-font: var(--vpick--font-default);
  --vpick--table-cell-border-radius: 8px;
  --vpick--table-cell-border-width: 2px;
  --vpick--table-cell-border: var(--vpick--table-cell-border-width) solid;

  --vpick--table-cell-color: var(--vpick--color-text-primary);
  --vpick--table-cell-bg-color: var(--vpick--color-background-text-primary);
  --vpick--table-cell-border-color: transparent;

  --vpick--table-cell-hover-color: var(--vpick--color-primary-hover);
  --vpick--table-cell-hover-bg-color: var(--vpick--color-background-blue-hover);
  --vpick--table-cell-hover-border-color: var(--vpick--color-primary-hover);

  --vpick--table-cell-selected-color: var(--vpick--color-white);
  --vpick--table-cell-selected-bg-color: var(--vpick--color-primary-hover);
  --vpick--table-cell-selected-border-color: var(--vpick--color-primary-hover);

  --vpick--table-cell-disabled-color: var(--vpick--color-text-secondary);
  --vpick--table-cell-disabled-bg-color: var(--vpick--color-white);
  --vpick--table-cell-disabled-border-color: var(--vpick--color-white);
}
```

### TimePicker

```css
:root {
  /* TIME PICKER */
  --vpick--time-content-margin-bottom: 8px;

  --vpick--time-control-btn-size: 24px;
  --vpick--time-control-btn-bg-color: unset;
  --vpick--time-control-btn-icon-color: var(--vpick--color-text-primary);

  --vpick--time-control-btn-hover-bg-color: var(
    --vpick--time-control-btn-hover-bg-color
  );
  --vpick--time-control-btn-hover-icon-color: var(--vpick--color-primary);
  --vpick--time-control-btn-focus-bg-color: var(
    --vpick--time-control-btn-hover-bg-color
  );
  --vpick--time-control-btn-focus-icon-color: var(
    --vpick--time-control-btn-hover-icon-color
  );
  --vpick--time-control-btn-disabled-bg-color: var(
    --vpick--time-control-btn-hover-bg-color
  );
  --vpick--time-control-btn-disabled-icon-color: var(
    --vpick--color-placeholder
  );

  --vpick--time-bar-gap: 8px;
  --vpick--time-bar-content-widht: 48px;
  --vpick--time-bar-content-height: 160px;
  --vpick--time-bar-separator-width: 2px;

  --vpick--time-bar-item-padding-width: 16px;
  --vpick--time-bar-item-padding-height: 8px;
  --vpick--time-bar-item-font-size: 16px;
  --vpick--time-bar-item-font-weight: 400;
  --vpick--time-bar-item-color: var(--vpick--color-text-primary);
  --vpick--time-bar-item-bg-color: transparent;

  --vpick--time-bar-item-hover-color: var(--vpick--color-primary);
  --vpick--time-bar-item-hover-bg-color: var(--vpick--time-bar-item-bg-color);
  --vpick--time-bar-item-selected-color: var(--vpick--color-primary);
  --vpick--time-bar-item-selected-bg-color: var(
    --vpick--time-bar-item-bg-color
  );
  --vpick--time-bar-item-disabled-color: var(--vpick--color-placeholder);
  --vpick--time-bar-item-disabled-bg-color: var(
    --vpick--time-bar-item-bg-color
  );

  --vpick--time-bar-list-padding: calc(
    (
        (var(--vpick--time-bar-item-padding-height) * 2) +
          var(--vpick--time-bar-item-font-size)
      ) *
      2
  );
  --vpick--time-bar-list-select-section-height: calc(
    (var(--vpick--time-bar-item-padding-height) * 2) +
      var(--vpick--time-bar-item-font-size)
  );
  --vpick--time-bar-list-select-section-border-width: 1px;
  --vpick--time-bar-list-select-section-border-style: solid;
  --vpick--time-bar-list-select-section-border-color: var(
    --vpick--color-text-secondary
  );
}
```

### Input

```css
:root {
  /* Input */
  --vpick--input-font: var(--vpick--font-default);
  --vpick--input-height: 38px;
  --vpick--input-padding: 8px 12px;
  --vpick--input-bg-color: var(--vpick--color-white);
  --vpick--input-color: var(--vpick--color-text-primary);
  --vpick--input-border-width: 2px;
  --vpick--input-border-color: var(--vpick--color-border-light);
  --vpick--input-border-radius: 8px;
  --vpick--input-placeholder-color: var(--vpick--color-border-base);
  --vpick--input-icon-size: 24px;
  --vpick--input-icon-color: var(--vpick--color-text-regular);
  --vpick--input-icon-hover-color: var(--vpick--color-primary);

  --vpick--input-readonly-bg-color: var(--vpick--input-bg-color);
  --vpick--input-readonly-color: var(--vpick--input-color);
  --vpick--input-readonly-border-color: var(--vpick--input-border-color);

  --vpick--input-hover-bg-color: var(--vpick--input-bg-color);
  --vpick--input-hover-color: var(--vpick--input-color);
  --vpick--input-hover-border-color: var(--vpick--color-text-secondary);

  --vpick--input-focus-bg-color: var(--vpick--input-bg-color);
  --vpick--input-focus-color: var(--vpick--input-color);
  --vpick--input-focus-border-color: var(--vpick--color-primary);

  --vpick--input-disabled-bg-color: var(--vpick--color-background-text-primary);
  --vpick--input-disabled-color: var(--vpick--input-color);
  --vpick--input-disabled-border-color: var(--vpick--color-placeholder);

  --vpick--input-invalid-bg-color: var(--vpick--input-bg-color);
  --vpick--input-invalid-color: var(--vpick--color-error);
  --vpick--input-invalid-border-color: var(--vpick--color-error);
}
```

### Button

```css
:root {
  /* BUTTON */
  --vpick--button-font: var(--vpick--font-default);
  --vpick--button-border-radius: 8px;
  --vpick--button-padding: 4px 24px;

  --vpick--button-default-bg-color: var(--vpick--color-info);
  --vpick--button-default-font-color: var(--vpick--color-text-regular);

  --vpick--button-default-hover-bg-color: color-mix(
    in srgb,
    var(--vpick--color-info) 85%,
    var(--vpick--color-dark)
  );
  --vpick--button-default-hover-font-color: var(
    --vpick--button-default-font-color
  );

  --vpick--button-default-focus-bg-color: color-mix(
    in srgb,
    var(--vpick--color-info) 75%,
    var(--vpick--color-dark)
  );
  --vpick--button-default-focus-font-color: var(
    --vpick--button-default-font-color
  );

  --vpick--button-default-active-bg-color: color-mix(
    in srgb,
    var(--vpick--color-info) 65%,
    var(--vpick--color-dark)
  );
  --vpick--button-default-active-font-color: var(
    --vpick--button-default-font-color
  );

  --vpick--button-default-disabled-bg-color: color-mix(
    in srgb,
    var(--vpick--color-info) 50%,
    var(--vpick--color-white)
  );
  --vpick--button-default-disabled-font-color: color-mix(
    in srgb,
    var(--vpick--button-default-font-color) 50%,
    transparent
  );

  --vpick--button-submit-bg-color: var(--vpick--color-primary);
  --vpick--button-submit-font-color: var(--vpick--color-white);
  --vpick--button-submit-hover-bg-color: var(--vpick--color-primary-focus);
  --vpick--button-submit-hover-font-color: var(--vpick--color-white);
  --vpick--button-submit-focus-bg-color: var(--vpick--color-primary-focus);
  --vpick--button-submit-focus-font-color: var(--vpick--color-white);
  --vpick--button-submit-active-bg-color: var(--vpick--color-primary-disabled);
  --vpick--button-submit-active-font-color: var(--vpick--color-white);
  --vpick--button-submit-disabled-bg-color: var(
    --vpick--color-background-blue-hover
  );
  --vpick--button-submit-disabled-font-color: var(--vpick--color-primary);
}
```

### Button panel

```css
:root {
  /* BUTTON PANEL */
  --vpick--button-panel-justify-content: flex-end;
  --vpick--button-panel-gap: 10px;
  --vpick--button-panel-padding: 10px 0 0;
  --vpick--button-panel-border-top: 1px solid var(--vpick--color-border-base);
}
```

### Popover

```css
:root {
  /* POPOVER */
  --vpick--popover-padding: 12px;
  --vpick--popover-border: 1px solid var(--vpick--bolor-border-regular);
  --vpick--popover-border-radius: 8px;
  --vpick--popover-bg-color: var(--vpick--color-white);
  --vpick--popover-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
```

### Scrollbar

```css
:root {
  /* Scrollbar */
  --vpick--scrollbar-track-bg-color: transparent;
  --vpick--scrollbar-track-size: 15px;
  --vpick--scrollbar-active-track-opacity: 0.6;

  --vpick--scrollbar-track-hover-bg-color: var(--vpick--color-border-light);
  --vpick--scrollbar-track-hover-opacity: 0.9;
  --vpick--scrollbar-track-hover-thumb-size: 11px;
  --vpick--scrollbar-track-hover-thumb-bg-color: color-mix(
    in srgb,
    var(--vpick--color-border-regular) 80%,
    var(--vpick--color-text-secondary) 20%
  );

  --vpick--scrollbar-track-focus-bg-color: var(
    --vpick--scrollbar-track-hover-bg-color
  );
  --vpick--scrollbar-track-focus-opacity: var(
    --vpick--scrollbar-track-hover-opacity
  );
  --vpick--scrollbar-track-focus-thumb-size: var(
    --vpick--scrollbar-track-hover-thumb-size
  );
  --vpick--scrollbar-track-focus-thumb-bg-color: var(
    --vpick--scrollbar-track-hover-thumb-bg-color
  );

  --vpick--scrollbar-track-active-bg-color: var(
    --vpick--scrollbar-track-hover-bg-color
  );
  --vpick--scrollbar-track-active-opacity: var(
    --vpick--scrollbar-track-hover-opacity
  );
  --vpick--scrollbar-track-active-thumb-size: var(
    --vpick--scrollbar-track-hover-thumb-size
  );
  --vpick--scrollbar-track-active-thumb-bg-color: var(
    --vpick--scrollbar-track-hover-thumb-bg-color
  );

  --vpick--scrollbar-thumb-default-size: 6px;
  --vpick--scrollbar-thumb-offset: 2px;
  --vpick--scrollbar-thumb-border-radius: 6px;
  --vpick--scrollbar-thumb-bg-color: color-mix(
    in srgb,
    var(--vpick--color-border-base) 70%,
    var(--vpick--color-text-regular) 30%
  );
}
```

### Shortcut list

```css
:root {
  --vpick--shortcut-list-width: 140px;
  --vpick--shortcut-list-bg-color: transparent;
  --vpick--shortcut-list-border-right: 1px solid var(--vpick--color-border-base);
  --vpick--shortcut-list-padding: unset;

  --vpick--shortcut-list-item-font: var(--vpick--font-default);
  --vpick--shortcut-list-item-text-align: center;
  --vpick--shortcut-list-item-padding: 10px 0;
  --vpick--shortcut-list-item-bg-color: transparent;
  --vpick--shortcut-list-item-color: var(--vpick--color-text-primary);
  --vpick--shortcut-list-item-border: unset;

  --vpick--shortcut-list-item-hover-bg-color: var(
    --vpick--shortcut-list-item-bg-color
  );
  --vpick--shortcut-list-item-hover-color: var(--vpick--color-primary);
  --vpick--shortcut-list-item-hover-border: var(
    --vpick--shortcut-list-item-border
  );
}
```

### All variables

```css
:root {
  /* Primary */
  --vpick--color-primary: #3a5ccc;
  --vpick--color-error: #d5393e;
  --vpick--color-info: #dddddd;

  /* Text */
  --vpick--color-text-primary: #2a2f3b;
  --vpick--color-text-regular: #656a78;
  --vpick--color-text-secondary: #c4c4c4;
  --vpick--color-placeholder: #888888;

  /* Borders */
  --vpick--color-border-base: #dddddd;
  --vpick--bolor-border-regular: #cccccc;
  --vpick--color-border-light: #ededed;

  /* Backgrounds */
  --vpick--color-dark: #000000;
  --vpick--color-white: #ffffff;

  /* Font */
  --vpick--font-family: 'Roboto', 'Arial', 'Helvetica', 'Segoe UI', sans-serif;

  --vpick--font-default-font-weight: 400;
  --vpick--font-default-font-size: 14px;
  --vpick--font-default-line-height: 24px;

  --vpick--font-medium-font-weight: 500;
  --vpick--font-medium-font-size: 16px;
  --vpick--font-medium-line-height: 26px;

  /* Common */
  --vpick--animation-delay: 0.3s;

  /* Computed */
  --vpick--color-background-text-primary: color-mix(
    in srgb,
    var(--vpick--color-text-primary) 10%,
    var(--vpick--color-white) 90%
  );

  --vpick--color-primary-hover: color-mix(
    in srgb,
    var(--vpick--color-primary) 90%,
    var(--vpick--color-white)
  );

  --vpick--color-primary-focus: color-mix(
    in srgb,
    var(--vpick--color-primary) 85%,
    var(--vpick--color-dark)
  );

  --vpick--color-primary-disabled: color-mix(
    in srgb,
    var(--vpick--color-primary) 40%,
    var(--vpick--color-white)
  );

  --vpick--color-background-blue-light: color-mix(
    in srgb,
    var(--vpick--color-primary) 20%,
    var(--vpick--color-white)
  );

  --vpick--color-background-blue-hover: color-mix(
    in srgb,
    var(--vpick--color-primary) 15%,
    var(--vpick--color-white)
  );

  --vpick--font-default: var(--vpick--font-default-font-weight)
    var(--vpick--font-default-font-size) /
    var(--vpick--font-default-line-height) var(--vpick--font-family);

  --vpick--font-medium: var(--vpick--font-medium-font-weight)
    var(--vpick--font-medium-font-size) / var(--vpick--font-medium-line-height)
    var(--vpick--font-family);

  /* Input */
  --vpick--input-font: var(--vpick--font-default);
  --vpick--input-height: 38px;
  --vpick--input-padding: 8px 12px;
  --vpick--input-bg-color: var(--vpick--color-white);
  --vpick--input-color: var(--vpick--color-text-primary);
  --vpick--input-border-width: 2px;
  --vpick--input-border-color: var(--vpick--color-border-light);
  --vpick--input-border-radius: 8px;
  --vpick--input-placeholder-color: var(--vpick--color-border-base);
  --vpick--input-icon-size: 24px;
  --vpick--input-icon-color: var(--vpick--color-text-regular);
  --vpick--input-icon-hover-color: var(--vpick--color-primary);

  --vpick--input-readonly-bg-color: var(--vpick--input-bg-color);
  --vpick--input-readonly-color: var(--vpick--input-color);
  --vpick--input-readonly-border-color: var(--vpick--input-border-color);

  --vpick--input-hover-bg-color: var(--vpick--input-bg-color);
  --vpick--input-hover-color: var(--vpick--input-color);
  --vpick--input-hover-border-color: var(--vpick--color-text-secondary);

  --vpick--input-focus-bg-color: var(--vpick--input-bg-color);
  --vpick--input-focus-color: var(--vpick--input-color);
  --vpick--input-focus-border-color: var(--vpick--color-primary);

  --vpick--input-disabled-bg-color: var(--vpick--color-background-text-primary);
  --vpick--input-disabled-color: var(--vpick--input-color);
  --vpick--input-disabled-border-color: var(--vpick--color-placeholder);

  --vpick--input-invalid-bg-color: var(--vpick--input-bg-color);
  --vpick--input-invalid-color: var(--vpick--color-error);
  --vpick--input-invalid-border-color: var(--vpick--color-error);

  /* DATE TIME PICKER */
  --vpick--date-time-content-column-gap: 10px;
  --vpick--date-time-content-padding-bottom: 10px;

  --vpick--control-btn-size: 24px;
  --vpick--control-btn-bg-color: unset;
  --vpick--control-hover-btn-bg-color: unset;
  --vpick--control-focus-btn-bg-color: unset;
  --vpick--control-disabled-btn-bg-color: unset;

  --vpick--control-btn-icon-size: 18px;
  --vpick--control-btn-icon-color: var(--vpick--color-text-primary);
  --vpick--control-hover-btn-icon-color: var(--vpick--color-primary);
  --vpick--control-focus-btn-icon-color: var(--vpick--color-primary);
  --vpick--control-disabled-btn-icon-color: var(--vpick--color-text-primary);

  --vpick--panel-center-height: 35px;
  --vpick--panel-center-control-gap: 8px;
  --vpick--panel-center-control-minmax-width: minmax(130px, auto);
  --vpick--panel-center-control-font: var(--vpick--font-medium);
  --vpick--panel-center-control-color: var(--vpick--color-text-primary);
  --vpick--panel-center-control-hover-color: var(--vpick--color-primary);
  --vpick--panel-center-control-focus-color: var(--vpick--color-primary);
  --vpick--panel-center-control-disabled-color: var(
    --vpick--color-text-primary
  );
  --vpick--panel-center-control-text-transform-month: capitalize;
  --vpick--panel-margin-bottom: 4px;

  --vpick--month-table-cell-size: 58px;
  --vpick--month-table-cell-today-left: calc(
    (
        var(--vpick--month-table-cell-size) -
          var(--vpick--table-cell-today-size)
      ) /
      2
  );
  --vpick--month-table-cell-text-transform: capitalize;

  --vpick--year-table-cell-size: 58px;
  --vpick--year-table-cell-today-left: calc(
    (var(--vpick--year-table-cell-size) - var(--vpick--table-cell-today-size)) /
      2
  );

  --vpick--table-range-gap: 10px;

  --vpick--table-cell-gap: 2px;
  --vpick--table-cell-today-size: 4px;
  --vpick--table-cell-today-bottom: var(--vpick--table-cell-today-size);
  --vpick--table-cell-today-color: var(--vpick--color-primary);
  --vpick--table-cell-today-selected-color: var(--vpick--color-white);

  --vpick--day-table-weekdays-margin-bottom: 8px;
  --vpick--day-table-weekdays-color: var(--vpick--color-text-secondary);
  --vpick--day-table-weekdays-bg-color: unset;
  --vpick--day-table-weekdays-text-transform: capitalize;
  --vpick--day-table-cell-size: 35px;
  --vpick--day-table-cell-today-left: calc(
    (var(--vpick--day-table-cell-size) - var(--vpick--table-cell-today-size)) /
      var(--vpick--table-cell-border-width) * 2
  );

  --vpick--day-table-cell-other-month-color: var(
    --vpick--table-cell-disabled-color
  );
  --vpick--day-table-cell-other-month-bg-color: var(
    --vpick--table-cell-disabled-bg-color
  );
  --vpick--day-table-cell-other-month-border-color: var(
    --vpick--table-cell-disabled-border-color
  );

  --vpick--day-table-cell-range-color: var(--vpick--table-cell-hover-color);
  --vpick--day-table-cell-range-bg-color: var(
    --vpick--table-cell-hover-bg-color
  );
  --vpick--day-table-cell-range-border-color: var(
    --vpick--table-cell-hover-bg-color
  );

  --vpick--day-table-cell-range-hover-color: var(
    --vpick--table-cell-hover-color
  );
  --vpick--day-table-cell-range-hover-bg-color: var(
    --vpick--table-cell-hover-bg-color
  );
  --vpick--day-table-cell-range-hover-border-color: var(
    --vpick--table-cell-hover-bg-color
  );

  --vpick--table-cell-font: var(--vpick--font-default);
  --vpick--table-cell-border-radius: 8px;
  --vpick--table-cell-border-width: 2px;
  --vpick--table-cell-border: var(--vpick--table-cell-border-width) solid;

  --vpick--table-cell-color: var(--vpick--color-text-primary);
  --vpick--table-cell-bg-color: var(--vpick--color-background-text-primary);
  --vpick--table-cell-border-color: transparent;

  --vpick--table-cell-hover-color: var(--vpick--color-primary-hover);
  --vpick--table-cell-hover-bg-color: var(--vpick--color-background-blue-hover);
  --vpick--table-cell-hover-border-color: var(--vpick--color-primary-hover);

  --vpick--table-cell-selected-color: var(--vpick--color-white);
  --vpick--table-cell-selected-bg-color: var(--vpick--color-primary-hover);
  --vpick--table-cell-selected-border-color: var(--vpick--color-primary-hover);

  --vpick--table-cell-disabled-color: var(--vpick--color-text-secondary);
  --vpick--table-cell-disabled-bg-color: var(--vpick--color-white);
  --vpick--table-cell-disabled-border-color: var(--vpick--color-white);

  /* TIME PICKER */
  --vpick--time-content-margin-bottom: 8px;

  --vpick--time-control-btn-size: 24px;
  --vpick--time-control-btn-bg-color: unset;
  --vpick--time-control-btn-icon-color: var(--vpick--color-text-primary);

  --vpick--time-control-btn-hover-bg-color: var(
    --vpick--time-control-btn-hover-bg-color
  );
  --vpick--time-control-btn-hover-icon-color: var(--vpick--color-primary);
  --vpick--time-control-btn-focus-bg-color: var(
    --vpick--time-control-btn-hover-bg-color
  );
  --vpick--time-control-btn-focus-icon-color: var(
    --vpick--time-control-btn-hover-icon-color
  );
  --vpick--time-control-btn-disabled-bg-color: var(
    --vpick--time-control-btn-hover-bg-color
  );
  --vpick--time-control-btn-disabled-icon-color: var(
    --vpick--color-placeholder
  );

  --vpick--time-bar-gap: 8px;
  --vpick--time-bar-content-widht: 48px;
  --vpick--time-bar-content-height: 160px;
  --vpick--time-bar-separator-width: 2px;

  --vpick--time-bar-item-padding-width: 16px;
  --vpick--time-bar-item-padding-height: 8px;
  --vpick--time-bar-item-font-size: 16px;
  --vpick--time-bar-item-font-weight: 400;
  --vpick--time-bar-item-color: var(--vpick--color-text-primary);
  --vpick--time-bar-item-bg-color: transparent;

  --vpick--time-bar-item-hover-color: var(--vpick--color-primary);
  --vpick--time-bar-item-hover-bg-color: var(--vpick--time-bar-item-bg-color);
  --vpick--time-bar-item-selected-color: var(--vpick--color-primary);
  --vpick--time-bar-item-selected-bg-color: var(
    --vpick--time-bar-item-bg-color
  );
  --vpick--time-bar-item-disabled-color: var(--vpick--color-placeholder);
  --vpick--time-bar-item-disabled-bg-color: var(
    --vpick--time-bar-item-bg-color
  );

  --vpick--time-bar-list-padding: calc(
    (
        (var(--vpick--time-bar-item-padding-height) * 2) +
          var(--vpick--time-bar-item-font-size)
      ) *
      2
  );
  --vpick--time-bar-list-select-section-height: calc(
    (var(--vpick--time-bar-item-padding-height) * 2) +
      var(--vpick--time-bar-item-font-size)
  );
  --vpick--time-bar-list-select-section-border-width: 1px;
  --vpick--time-bar-list-select-section-border-style: solid;
  --vpick--time-bar-list-select-section-border-color: var(
    --vpick--color-text-secondary
  );

  /* SHORTCUT */
  --vpick--shortcut-list-width: 140px;
  --vpick--shortcut-list-bg-color: transparent;
  --vpick--shortcut-list-border-right: 1px solid var(--vpick--color-border-base);
  --vpick--shortcut-list-padding: unset;

  --vpick--shortcut-list-item-font: var(--vpick--font-default);
  --vpick--shortcut-list-item-text-align: center;
  --vpick--shortcut-list-item-padding: 10px 0;
  --vpick--shortcut-list-item-bg-color: transparent;
  --vpick--shortcut-list-item-color: var(--vpick--color-text-primary);
  --vpick--shortcut-list-item-border: unset;

  --vpick--shortcut-list-item-hover-bg-color: var(
    --vpick--shortcut-list-item-bg-color
  );
  --vpick--shortcut-list-item-hover-color: var(--vpick--color-primary);
  --vpick--shortcut-list-item-hover-border: var(
    --vpick--shortcut-list-item-border
  );

  /* BUTTON PANEL */
  --vpick--button-panel-justify-content: flex-end;
  --vpick--button-panel-gap: 10px;
  --vpick--button-panel-padding: 10px 0 0;
  --vpick--button-panel-border-top: 1px solid var(--vpick--color-border-base);

  /* BUTTON */
  --vpick--button-font: var(--vpick--font-default);
  --vpick--button-border-radius: 8px;
  --vpick--button-padding: 4px 24px;

  --vpick--button-default-bg-color: var(--vpick--color-info);
  --vpick--button-default-font-color: var(--vpick--color-text-regular);

  --vpick--button-default-hover-bg-color: color-mix(
    in srgb,
    var(--vpick--color-info) 85%,
    var(--vpick--color-dark)
  );
  --vpick--button-default-hover-font-color: var(
    --vpick--button-default-font-color
  );

  --vpick--button-default-focus-bg-color: color-mix(
    in srgb,
    var(--vpick--color-info) 75%,
    var(--vpick--color-dark)
  );
  --vpick--button-default-focus-font-color: var(
    --vpick--button-default-font-color
  );

  --vpick--button-default-active-bg-color: color-mix(
    in srgb,
    var(--vpick--color-info) 65%,
    var(--vpick--color-dark)
  );
  --vpick--button-default-active-font-color: var(
    --vpick--button-default-font-color
  );

  --vpick--button-default-disabled-bg-color: color-mix(
    in srgb,
    var(--vpick--color-info) 50%,
    var(--vpick--color-white)
  );
  --vpick--button-default-disabled-font-color: color-mix(
    in srgb,
    var(--vpick--button-default-font-color) 50%,
    transparent
  );

  --vpick--button-submit-bg-color: var(--vpick--color-primary);
  --vpick--button-submit-font-color: var(--vpick--color-white);
  --vpick--button-submit-hover-bg-color: var(--vpick--color-primary-focus);
  --vpick--button-submit-hover-font-color: var(--vpick--color-white);
  --vpick--button-submit-focus-bg-color: var(--vpick--color-primary-focus);
  --vpick--button-submit-focus-font-color: var(--vpick--color-white);
  --vpick--button-submit-active-bg-color: var(--vpick--color-primary-disabled);
  --vpick--button-submit-active-font-color: var(--vpick--color-white);
  --vpick--button-submit-disabled-bg-color: var(
    --vpick--color-background-blue-hover
  );
  --vpick--button-submit-disabled-font-color: var(--vpick--color-primary);

  /* POPOVER */
  --vpick--popover-padding: 12px;
  --vpick--popover-border: 1px solid var(--vpick--bolor-border-regular);
  --vpick--popover-border-radius: 8px;
  --vpick--popover-bg-color: var(--vpick--color-white);
  --vpick--popover-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  /* Scrollbar */
  --vpick--scrollbar-track-bg-color: transparent;
  --vpick--scrollbar-track-size: 15px;
  --vpick--scrollbar-active-track-opacity: 0.6;

  --vpick--scrollbar-track-hover-bg-color: var(--vpick--color-border-light);
  --vpick--scrollbar-track-hover-opacity: 0.9;
  --vpick--scrollbar-track-hover-thumb-size: 11px;
  --vpick--scrollbar-track-hover-thumb-bg-color: color-mix(
    in srgb,
    var(--vpick--color-border-regular) 80%,
    var(--vpick--color-text-secondary) 20%
  );

  --vpick--scrollbar-track-focus-bg-color: var(
    --vpick--scrollbar-track-hover-bg-color
  );
  --vpick--scrollbar-track-focus-opacity: var(
    --vpick--scrollbar-track-hover-opacity
  );
  --vpick--scrollbar-track-focus-thumb-size: var(
    --vpick--scrollbar-track-hover-thumb-size
  );
  --vpick--scrollbar-track-focus-thumb-bg-color: var(
    --vpick--scrollbar-track-hover-thumb-bg-color
  );

  --vpick--scrollbar-track-active-bg-color: var(
    --vpick--scrollbar-track-hover-bg-color
  );
  --vpick--scrollbar-track-active-opacity: var(
    --vpick--scrollbar-track-hover-opacity
  );
  --vpick--scrollbar-track-active-thumb-size: var(
    --vpick--scrollbar-track-hover-thumb-size
  );
  --vpick--scrollbar-track-active-thumb-bg-color: var(
    --vpick--scrollbar-track-hover-thumb-bg-color
  );

  --vpick--scrollbar-thumb-default-size: 6px;
  --vpick--scrollbar-thumb-offset: 2px;
  --vpick--scrollbar-thumb-border-radius: 6px;
  --vpick--scrollbar-thumb-bg-color: color-mix(
    in srgb,
    var(--vpick--color-border-base) 70%,
    var(--vpick--color-text-regular) 30%
  );
}
```
