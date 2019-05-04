import rule from '../../src/rules/codelyzer/use-component-view-encapsulation';
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

ruleTester.run('use-component-view-encapsulation', rule, {
  valid: [
    `
    @Component({
      encapsulation: ViewEncapsulation.Emulated,
      selector: 'app-foo-bar'
    })
    export class Test {}
`,
    `
    @Component({
      encapsulation: ViewEncapsulation.Native,
      selector: 'app-foo-bar'
    })
    export class Test {}
`,
    `
    @Component({
      encapsulation: ViewEncapsulation.ShadowDom,
      selector: 'app-foo-bar'
    })
    export class Test {}
`,
    `
    @Component({
      selector: 'app-foo-bar'
    })
    export class Test {}
`,
    `
    @NgModule({
      bootstrap: [Foo]
    })
    export class Test {}
`,
  ],
  invalid: [
    {
      // it should fail if ViewEncapsulation.None is set
      code: `
      @Component({
        encapsulation: ViewEncapsulation.None,
        selector: 'app-foo-bar',
      })
      export class Test {}
`,
      errors: [
        {
          messageId: 'useComponentViewEncapsulation',
          line: 3,
          column: 24,
        },
      ],
    },
  ],
});
