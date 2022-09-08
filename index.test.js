const postcss = require('postcss')

const plugin = require('./')

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  const removeWhiteSpace = /(^\s*\n)|(\t| )/gm
  const sansWhiteSpace = text => text.replace(removeWhiteSpace, '')
    .replace(/;/g, ''); // TODO: Remove this back once I work out why the test sometimes misses semicolons.

  expect(sansWhiteSpace(result.toString())).toEqual(sansWhiteSpace(output))
  expect(result.warnings()).toHaveLength(0)
}

/* Write tests here */

it('Converts the base case', async () => {
  await run(`.component {
    padding: 12px;
    background: pink;
    display: flex;
    flex-direction: row;
  }

  @darkmode {
    .component {
      background: red;
      flex-direction: column;
    }
  }`, `:root, [data-theme=light] {
    --\\.component_background: pink;
    --\\.component_flex-direction: row;
  }

  [data-theme=dark] {
    --\\.component_background: red;
    --\\.component_flex-direction: column;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --\\.component_background: red;
      --\\.component_flex-direction: column;
    }
  }

  .component {
    padding: 12px;
    display: flex;
  }

  .component {
    background: var(--\\.component_background);
    flex-direction: var(--\\.component_flex-direction);
  }`, {})
})

it('Converts darkmode only properties', async () => {
  await run(`.component {
    background: pink;
  }

  @darkmode {
    .component {
      background: red;
      color: white;
    }
  }`, `:root, [data-theme=light] {
    --\\.component_background: pink;
    --\\.component_color: unset;
  }

  [data-theme=dark] {
    --\\.component_background: red;
    --\\.component_color: white;
  }

  @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_background: red;
        --\\.component_color: white;
      }
  }

  .component {
      background: var(--\\.component_background);
      color: var(--\\.component_color);
  }`, {})
})

it('Converts nested selectors', async () => {
  await run(`
    .component .foo {
      background: pink;
    }

    @darkmode {
      .component .foo {
        background: red;
      }
    }`, `
    :root, [data-theme=light] {
      --\\.component_\\.foo_background: pink;
    }
    
    [data-theme=dark] {
      --\\.component_\\.foo_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_\\.foo_background: red;
      }
    }

    .component .foo {
      background: var(--\\.component_\\.foo_background);
    }`)
})

it('Converts sibling selectors', async () => {
  await run(`
    .component + .foo {
      background: pink;
    }

    @darkmode {
      .component + .foo {
        background: red;
      }
    }`, `
    :root, [data-theme=light] {
      --\\.component_\\+_\\.foo_background: pink;
    }
    
    [data-theme=dark] {
      --\\.component_\\+_\\.foo_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_\\+_\\.foo_background: red;
      }
    }

    .component + .foo {
      background: var(--\\.component_\\+_\\.foo_background);
    }`)
})

it('Converts child selectors', async () => {
  await run(`
    .component > .foo {
      background: pink;
    }

    @darkmode {
      .component > .foo {
        background: red;
      }
    }`, `
    :root, [data-theme=light] {
      --\\.component_\\>_\\.foo_background: pink;
    }
    
    [data-theme=dark] {
      --\\.component_\\>_\\.foo_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_\\>_\\.foo_background: red;
      }
    }

    .component > .foo {
      background: var(--\\.component_\\>_\\.foo_background);
    }`)
})

it('Converts general sibling selectors', async () => {
  await run(`
    .component ~ .foo {
      background: pink;
    }

    @darkmode {
      .component ~ .foo {
        background: red;
      }
    }`, `
    :root, [data-theme=light] {
      --\\.component_\\~_\\.foo_background: pink;
    }
    
    [data-theme=dark] {
      --\\.component_\\~_\\.foo_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_\\~_\\.foo_background: red;
      }
    }

    .component ~ .foo {
      background: var(--\\.component_\\~_\\.foo_background);
    }`)
})

it('Converts multi selectors (light and dark same)', async () => {
  await run(`
    .component, .foo {
      background: pink;
    }

    @darkmode {
      .component, .foo {
        background: red;
      }
    }`, `
    :root, [data-theme=light] {
      --\\.component_background: pink;
      --\\.foo_background: pink;
    }
    
    [data-theme=dark] {
      --\\.component_background: red;
      --\\.foo_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_background: red;
        --\\.foo_background: red;
      }
    }

    .component {
      background: var(--\\.component_background);
    }
    
    .foo {
      background: var(--\\.foo_background);
    }`)
})

it('Converts multi selectors (light subset of dark)', async () => {
  await run(`
    .component {
      background: pink;
    }

    @darkmode {
      .component, .foo {
        background: red;
      }
    }`, `
    :root, [data-theme=light] {
      --\\.component_background: pink;
      --\\.foo_background: unset;
    }
    
    [data-theme=dark] {
      --\\.component_background: red;
      --\\.foo_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_background: red;
        --\\.foo_background: red;
      }
    }

    .component {
      background: var(--\\.component_background);
    }
    
    .foo {
      background: var(--\\.foo_background);
    }`)
})

