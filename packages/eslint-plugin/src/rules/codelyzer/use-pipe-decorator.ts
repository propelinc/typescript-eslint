import * as util from '../../util';
import { AngularClassDecorators } from './util/utils';
import {
  getPipeDecorator,
  getDeclaredInterfaceName,
} from './util/utils.ts-estree';

type Options = [];
type MessageIds = 'usePipeDecorator';

const PIPE_TRANSFORM = 'PipeTransform';

export default util.createRule<Options, MessageIds>({
  name: 'use-pipe-decorator',
  meta: {
    type: 'suggestion',
    docs: {
      description: `Ensures that classes implementing ${PIPE_TRANSFORM} interface use @${
        AngularClassDecorators.Pipe
      } decorator`,
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {},
      },
    ],
    messages: {
      usePipeDecorator: `Classes that implement the ${PIPE_TRANSFORM} interface should be decorated with @${
        AngularClassDecorators.Pipe
      }`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node) {
        if (
          getPipeDecorator(node) ||
          !getDeclaredInterfaceName(node, PIPE_TRANSFORM)
        ) {
          return;
        }

        context.report({
          node,
          messageId: 'usePipeDecorator',
        });
      },
    };
  },
});
