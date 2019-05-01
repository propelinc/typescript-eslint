import path from 'path';
import rule from '../../src/rules/codelyzer/use-lifecycle-interface';
import { RuleTester } from '../RuleTester';
import {
  AngularLifecycleInterfaces,
  AngularLifecycleMethods,
} from '../../src/rules/codelyzer/util/utils';

const rootPath = path.join(process.cwd(), 'tests/fixtures/');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: rootPath,
    project: './tsconfig.json',
  },
});

ruleTester.run('use-lifecycle-interface', rule, {
  valid: [
    `
    class Test implements OnInit {
      ngOnInit() {}
    }
 `,
    `
    class Test extends Component implements OnInit, OnDestroy  {
      ngOnInit() {}

      private ngOnChanges = '';

      ngOnDestroy() {}

      ngOnSmth() {}
    }
`,
    `
    class Test extends Component implements ng.OnInit, ng.OnDestroy  {
      ngOnInit() {}

      private ngOnChanges = '';

      ngOnDestroy() {}

      ngOnSmth() {}
    }
`,
    `
    class Test {}
`,
  ],
  invalid: [
    {
      // it should fail if lifecycle method is declared without implementing its interface
      code: `
      class Test {
        ngOnInit() {
        }
      }
`,
      errors: [
        {
          messageId: 'useLifecycleInterface',
          data: {
            interfaceName: AngularLifecycleInterfaces.OnInit,
            methodName: AngularLifecycleMethods.ngOnInit,
          },
          line: 3,
          column: 9,
        },
      ],
    },
    {
      // it should fail if one of the lifecycle methods is declared without implementing its interface
      code: `
      class Test extends Component implements OnInit {
        ngOnInit() {}

        ngOnDestroy() {
        }
      }
`,
      errors: [
        {
          messageId: 'useLifecycleInterface',
          data: {
            interfaceName: AngularLifecycleInterfaces.OnDestroy,
            methodName: AngularLifecycleMethods.ngOnDestroy,
          },
          line: 5,
          column: 9,
        },
      ],
    },
    {
      // it should fail if lifecycle methods are declared without implementing their interfaces
      code: `
      class Test {
        ngOnInit() {}

        ngOnDestroy() {}
      }
`,
      errors: [
        {
          messageId: 'useLifecycleInterface',
          data: {
            interfaceName: AngularLifecycleInterfaces.OnInit,
            methodName: AngularLifecycleMethods.ngOnInit,
          },
          line: 3,
          column: 9,
        },
        {
          messageId: 'useLifecycleInterface',
          data: {
            interfaceName: AngularLifecycleInterfaces.OnDestroy,
            methodName: AngularLifecycleMethods.ngOnDestroy,
          },
          line: 5,
          column: 9,
        },
      ],
    },
    {
      // it should fail if lifecycle methods are declared without implementing their interfaces, using namespace
      code: `
      class Test extends Component implements ng.OnInit {
        ngOnInit() {}

        ngOnDestroy() {
        }
      }
`,
      errors: [
        {
          messageId: 'useLifecycleInterface',
          data: {
            interfaceName: AngularLifecycleInterfaces.OnDestroy,
            methodName: AngularLifecycleMethods.ngOnDestroy,
          },
          line: 5,
          column: 9,
        },
      ],
    },
  ],
});
