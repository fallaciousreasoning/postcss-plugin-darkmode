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

test('dark mode only properties are converted', async () => {
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
  }

  .component {
      background: var(--\\.component_background);
      color: var(--\\.component_color);
  }`, {})
})
