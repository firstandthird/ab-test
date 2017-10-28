# AB Test

Simple A/B Testing library using [Domodule](https://github.com/firstandthird/domodule) and [Micro Metrics](https://github.com/firstandthird/micro-metrics-browser)

## Usage

```html
<body>
  <div data-module="ABTest" data-module-name="backgroundColor" data-module-value="red">
    <a href="" data-action="success">Test</a>
  </div>

  <!-- If action is not defined, assume click on element -->
  <a href="" data-module="ABTest" data-module-name="ctaText" data-module-value="Sign up Now">Sign up now</a>
</body>
```

It needs to receive some options or they should be defined on the window object:

* `url`: `data-module-url` as an option or have `metricsEndpoint` defined on the `window` object.
* `session`: `data-module-session-id` as an option or have `metricsSession` defined on the `window` object.
