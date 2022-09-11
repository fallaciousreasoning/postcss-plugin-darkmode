# postcss-plugin-darkmode

[PostCSS] plugin for an @darkmode AtRule.

[PostCSS]: https://github.com/postcss/postcss

The plugin allows you to toggle light and dark mode at different levels of the
DOM, without requiring any JavaScript at all! It works by extracting properties
used in Light & Dark mode into CSS variables.

```html
<html>
  <body> <!-- Uses the users color scheme, no theme is specified -->
    <div data-theme="dark"> <!-- This element, and all descendants use the dark theme -->
      <div> <!-- So this is dark! -->
        <div></div> <!-- And this! -->
        <div data-theme="light"> <!-- But this specifies the light theme, so it and it's children are light -->
          <div> </div> <!-- Light too! -->
        </div>
      </div>
    </div>
  </body>
</html>
```

```css
.foo {
  padding: 12px;
  background: pink;

  display: flex;
  flex-direction: column;
}

@darkmode {
  .foo {
    background: red;
    flex-direction: row;
  }
}
```

```css
:root, [data-theme=light] {
  --\.foo_background: pink;
  --\.foo_flex-direction: column;
}

[data-theme=dark] {
  --\.foo_background: red;
  --\.foo_flex-direction: row;
}

@media (prefers-color-scheme: dark) {
  :root {
    --\.foo_background: red;
    --\.foo_flex-direction: row;
  }
}

.foo {
  padding: 12px;
  display: flex;
  background: var(--\.foo_background);
  flex-direction: var(--\.foo_flex-direction);
}
```

With Sass
```sass
.foo {
  padding: 12px;
  background: pink;
  display: flex;
  flex-direction: column;

  @darkmode {
    background: red;
    flex-direction: row;
  }
}
```

```css
:root, [data-theme=light] {
  --\.foo_background: pink;
  --\.foo_flex-direction: column;
}

[data-theme=dark] {
  --\.foo_background: red;
  --\.foo_flex-direction: row;
}

@media (prefers-color-scheme: dark) {
  :root {
    --\.foo_background: red;
    --\.foo_flex-direction: row;
  }
}

.foo {
  padding: 12px;
  display: flex;
  background: var(--\.foo_background);
  flex-direction: var(--\.foo_flex-direction);
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-plugin-darkmode
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-plugin-darkmode'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
