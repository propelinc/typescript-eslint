import rule from '../../src/rules/codelyzer/use-pipe-transformer-interface';
import { RuleTester } from '../RuleTester';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    preserveNodeMaps: true
  },
});

ruleTester.run('use-pipe-transformer-interface', rule, {
  valid: [
    `
    @Pipe({ name: 'test' })
    export class TestPipe implements PipeTransform {
      transform(value: string) {}
    }
 `,
    `
    @OtherDecorator()
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
  ],
  invalid: [
    {
      // it should fail if a class is decorated with @Pipe and has no interface implemented
      code: `
      @Pipe({ name: 'test' })
      export class TestPipe {
        transform(value: string) {}
      }
`,
      errors: [
        {
          messageId: 'usePipeTransformerInterface',
          line: 3,
          column: 14,
        },
      ],
    },
    {
      // it should fail if a class is decorated with @Pipe and does not implement the PipeTransform interface
      code: `
      @Pipe({ name: 'test' })
      export class TestPipe implements AnInterface {
        transform(value: string) {}
      }
`,
      errors: [
        {
          messageId: 'usePipeTransformerInterface',
          line: 3,
          column: 14,
        },
      ],
    },
    {
      // it should fail if a class is decorated with @Pipe and other decorator and does not implement the PipeTransform interface
      code: `
      @OtherDecorator()
      @Pipe({ name: 'test' })
      export class TestPipe implements AnInterface {
        transform(value: string) {}
      }
`,
      errors: [
        {
          messageId: 'usePipeTransformerInterface',
          line: 4,
          column: 14,
        },
      ],
    },
  ],
});
