[![Build Status](https://travis-ci.org/advanced-rest-client/themes-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/themes-panel)  

# themes-panel

A panel to display themes installed in the application.

The element is an UI for themes logic in the application. It does not contain
logic to activate or discovery themes. It communicates with the application (model)
via custom events. See events description for more information. Note that most events
have to be cancelled.

Once the element is "opened" it queries for list of available themes, if it wasn't
already. When the list of themes changes call `refreshThemes()` on the element
to update list of themes in the UI.

### Example
```
<themes-panel></themes-panel>
```

## Theme model

Model for the `Theme` object is similar to `package.json` data model.

The object consist with the following properties:

- **name** `{String}` Theme name
- **main** `{String}` Theme main file in the theme main directory
- **path** `{String}` Absolute location of the theme on user's filesystem. If the location is relative then default theme location is used.
- **description** `{String}` Theme short description.

### Styling
`<themes-panel>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--themes-panel` | Mixin applied to the element | `{}`
`--arc-font-headline` | Mixin applied to the header | `{}`
`--arc-font-subhead` | Mixin applied to the subheader | `{}`
`--error-toast` | Mixin applied to the error toast | `{}`
`--empty-info` | Mixin applied to the label rendered when no data is available. | `{}`
`--warning-primary-color` | Main color of the warning messages | `#FF7043`
`--warning-contrast-color` | Contrast color for the warning color | `#fff`



### Events
| Name | Description | Params |
| --- | --- | --- |
| open-theme-doc | Dispatched when the user requested to open documentation for theme editor. If handled the event must be cancelled. Otherwise default action is performed (click on the link). | __none__ |
| theme-activate | Dispatched when the user selected a theme to be activated. | theme **Object** - The theme infor object. See element description for morel information. |
| theme-active-info | Dispatched when the element requests information about currently activated theme.  The element does not assume default theme. This event should always result with a theme info object.  The event is cancelable and the model must cancel the event when handling it. Otherwise the element will ignore the result and display error.  The result should be a Promise resolved to a `Theme` objects. See element description for data model. The promise must be set on `result` property of the `detail` object.  ## Example ```javascript e.preventDefault(); e.detail.result = Promise.resolve({...}); ``` | __none__ |
| theme-editor-create | Dispatched when the user requested to run theme editor to create a new theme. | __none__ |
| theme-editor-edit | Dispatched when the user requested to run theme editor to edit installed theme. | theme **Object** - The theme infor object. See element description for morel information. |
| themes-list | Dispatched when the element requests to list currently installed themes. The event is cancelable and the model must cancel the event when handling it. Otherwise the element will ignore the result and display error.  The result should be a Promise resolved to a list of `Theme` objects. See element description for data model. The promise must be set on `result` property of the `detail` object.  ## Example ```javascript e.preventDefault(); e.detail.result = Promise.resolve({...}); ``` | __none__ |
