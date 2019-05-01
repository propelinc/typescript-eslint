import path from 'path';
import rule from '../../src/rules/codelyzer/use-pipe-decorator';
import { RuleTester } from '../RuleTester';

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

ruleTester.run('use-pipe-decorator', rule, {
  valid: [
    `
    @Pipe({ name: 'test' })
    export class TestPipe implements PipeTransform {
      transform(value: string) {}
    }
 `,
    `
    @Pipe({ name: 'test' })
    export class TestPipe implements ng.PipeTransform {
      transform(value: string) {}
    }
`,
    `
    export class TestPipe {
      transform(value: string) {}
    }
`,
    `
    export class TestPipe implements NgTransform, OnInit {
      transform(value: string) {}
    }
`,
  ],
  invalid: [
    {
      // it should fail if a class implements PipeTransform interface without using @Pipe decorator
      code: `
      @Test()
      export class Test implements PipeTransform {}
`,
      errors: [
        {
          messageId: 'usePipeDecorator',
          line: 3,
          column: 14,
        },
      ],
    },
    {
      // it should fail if a class implements PipeTransform interface (using namespace) without using @Pipe decorator
      code: `
      @Test()
      export class Test implements ng.PipeTransform {}
`,
      errors: [
        {
          messageId: 'usePipeDecorator',
          line: 3,
          column: 14,
        },
      ],
    },
    {
      // it should fail if a class implements PipeTransform interface without using @Pipe or any decorator
      code: `
      export class TestPipe implements PipeTransform {
        transform(value: string) {}
      }
`,
      errors: [
        {
          messageId: 'usePipeDecorator',
          line: 2,
          column: 14,
        },
      ],
    },
    {
      // it should fail if a class implements PipeTransform interface without using @Pipe decorator, but multiple others
      code: `
      @Test()
      @Test2()
      export class Test implements PipeTransform {
      }
`,
      errors: [
        {
          messageId: 'usePipeDecorator',
          line: 4,
          column: 14,
        },
      ],
    },
  ],
});
