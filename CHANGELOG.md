## [0.2.0](https://github.com/boichik/vue3-date-time-picker/compare/v0.1.0...v0.2.0) (2025-02-26)

### Features

- Added a new global props `auto-apply` (default: **false**). 
  _Functionality_: if the props is “**true**”, when changing the value in the picker, there is no need to click the “Apply” button
- Added global props `start-id` (default: **"**).
  _Functionality_: When the prop has a value, it will be passed to the `id` attribute of the native input (or the first native inlet when the “range” mode is selected)
- Added global props `start-name` (default: **"**).
  _Functionality_: When the prop has a value, it will be passed to the `name` attribute of the native input (or the first native inlet when the “range” mode is selected)
- Added global props `end-id` (default: **"**).
  _Functionality_: When the prop has a value, it will be passed to the `id` attribute of the last native input
- Added global props `end-name` (default: **"**).
  _Functionality_: When the prop has a value, it will be passed to the `name` attribute of the last native input

### Critical changes
**There are no critical changes in this release**

## [0.1.0](https://github.com/boichik/vue3-date-time-picker/compare/v0.0.2...v0.1.0) (2025-02-20)

### Features
- A new `modes` attribute for the date-picker has been added. Now you can configure which calendar will be displayed in the popover, and in relation to this, the user will be able to choose a certain type of date that he needs. (More information in the documentation)

### Critical changes
> [!CAUTION]
> _Consider the following information before migrating to a new version of the package_

If you are using advanced component styling, note that several style variables have been renamed

`--vpick--day-table-cell-range-color`  => `--vpick--table-cell-range-color`
`--vpick--day-table-cell-range-bg-color` => `--vpick--table-cell-range-bg-color`
`--vpick--day-table-cell-range-border-color` => `--vpick--table-cell-range-border-color`

`--vpick--day-table-cell-range-hover-color` => `--vpick--table-cell-range-hover-color`
`--vpick--day-table-cell-range-hover-bg-colo`r => `--vpick--table-cell-range-hover-bg-color`
`--vpick--day-table-cell-range-hover-border-color` => `--vpick--table-cell-range-hover-border-color`



## [0.0.2](https://github.com/boichik/vue3-date-time-picker/compare/v0.0.1...v0.0.2) (2025-02-08)

### Features

- A new global attribute `input-readonly` has been added
- Props have been added for the default slot in the Date & Time pickers components, for cases when you need to use your own component or element.

### Fixed

- Fixed incorrect reference to the global styles file in the documentation

### Additional

- Added a link to the Codebox playground in the documentation

## [0.0.1](https://github.com/boichik/vue3-date-time-picker/commits/0.0.1) (2025-02-03)

Launching a component package in production with a basic set of functionality

The documentation page has been initialised
Created vue components (AppDateTimePicker, AppTimePicker)
Basic functionality is covered by tests
