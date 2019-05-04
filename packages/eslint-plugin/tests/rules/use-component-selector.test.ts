import rule from '../../src/rules/codelyzer/use-component-selector';
import { RuleTester } from '../RuleTester';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    preserveNodeMaps: true,
  },
});

ruleTester.run('use-component-selector', rule, {
  valid: [
    `
    @Component({
      selector: 'sg-bar-foo'
    })
    class Test {}
`,
  ],
  invalid: [
    {
      // it should fail when selector is not given in @Component
      code: `
      @Component()
      class Test {}
`,
      errors: [
        {
          messageId: 'useComponentSelector',
          line: 2,
          column: 7,
        },
      ],
    },
    {
      // it should fail when selector is empty in @Component
      code: `
      @Component({
        selector: ''
      })
      class Test {}
`,
      errors: [
        {
          messageId: 'useComponentSelector',
          line: 2,
          column: 7,
        },
      ],
    },
    {
      // it should fail when selector equals 0 in @Component
      code: `
      @Component({
        selector: 0
      })
      class Test {}
`,
      errors: [
        {
          messageId: 'useComponentSelector',
          line: 2,
          column: 7,
        },
      ],
    },
    {
      // it should fail when selector equals null in @Component
      code: `
      @Component({
        selector: null
      })
      class Test {}
`,
      errors: [
        {
          messageId: 'useComponentSelector',
          line: 2,
          column: 7,
        },
      ],
    },
  ],
});
