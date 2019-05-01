import * as ts from 'typescript';
import * as util from '../../util';
import { getParserServices } from '../../util';
import {
  AngularClassDecorators,
  getDeclaredInterfaceName,
  getPipeDecorator,
} from './util/utils';

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
    const services = getParserServices(context);

    return {
      ClassDeclaration(node) {
        const tsNode = services.esTreeNodeToTSNodeMap.get<ts.ClassDeclaration>(
          node,
        );

        if (
          getPipeDecorator(tsNode) ||
          !getDeclaredInterfaceName(tsNode, PIPE_TRANSFORM)
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
