# postcss-plugin-darkmode

[PostCSS] plugin for an @darkmode AtRule.

[PostCSS]: https://github.com/postcss/postcss

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
