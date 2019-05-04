import * as ts from 'typescript';
import * as util from '../../util';
import { getNodeMaps } from '../../util';
import { ComponentMetadata } from './angular';
import { ngWalkerFactoryUtils } from './angular/ngWalkerFactoryUtils';
import { getClassName, getDecoratorPropertyInitializer } from './util/utils';

type Options = [];
type MessageIds = 'useComponentViewEncapsulation';

const NONE = 'None';

export default util.createRule<Options, MessageIds>({
  name: 'use-component-view-encapsulation',
  meta: {
    type: 'suggestion',
    docs: {
      description: `Disallows using ViewEncapsulation.${NONE}.`,
      category: 'Best Practices',
      recommended: false,
    },
    schema: [],
    messages: {
      useComponentViewEncapsulation: `Using ViewEncapsulation.${NONE} makes your styles global, which may have an unintended effect`,
    },
  },
  defaultOptions: [],
  create(context) {
    const nodeMaps = getNodeMaps(context);
    const metadataReader = ngWalkerFactoryUtils.defaultMetadataReader();

    return {
      ClassDeclaration(node) {
        const tsNode = nodeMaps.esTreeNodeToTSNodeMap.get<ts.ClassDeclaration>(
          node,
        );

        if (getClassName(tsNode)) {
          const metadata = metadataReader.read(tsNode);
          if (metadata instanceof ComponentMetadata) {
            const encapsulationExpression = getDecoratorPropertyInitializer(
              metadata.decorator,
              'encapsulation',
            );

            if (
              !encapsulationExpression ||
              (ts.isPropertyAccessExpression(encapsulationExpression) &&
                encapsulationExpression.name.text !== NONE)
            ) {
              return;
            }

            context.report({
              node: nodeMaps.tsNodeToESTreeNodeMap.get(
                (encapsulationExpression as unknown) as ts.ExpressionStatement,
              ),
              messageId: 'useComponentViewEncapsulation',
            });
          }
        }
      },
    };
  },
});
