import { TSESTree } from '@typescript-eslint/typescript-estree';
import * as ts from 'typescript';
import * as util from '../../util';
import { getParserServices } from '../../util';
import { AngularClassDecorators, getDeclaredInterfaceName, getPipeDecorator } from './util/utils';

type Options = [];
type MessageIds = 'usePipeTransformerInterface';

const PIPE_TRANSFORM = 'PipeTransform';

export default util.createRule<Options, MessageIds>({
  name: 'use-pipe-transformer-interface',
  meta: {
    type: 'suggestion',
    docs: {
      description: `Ensures tht classes decorated with @${
        AngularClassDecorators.Pipe
      } implement ${PIPE_TRANSFORM} interface.`,
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
      usePipeTransformerInterface: `Classes decorated with @${
        AngularClassDecorators.Pipe
      } decorator should implement ${PIPE_TRANSFORM} interface`,
    },
  },
  defaultOptions: [],
  create(context) {
    const services = getParserServices(context);

    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const tsNode = services.esTreeNodeToTSNodeMap.get<ts.ClassDeclaration>(
          node,
        );

        if (
          !getPipeDecorator(tsNode) ||
          getDeclaredInterfaceName(tsNode, PIPE_TRANSFORM)
        ) {
          return;
        }

        context.report({
          node,
          messageId: 'usePipeTransformerInterface',
        });
      },
    };
  },
});
