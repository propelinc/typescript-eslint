import * as ts from 'typescript';
import * as util from '../../util';
import { getNodeMaps } from '../../util';
import { ComponentMetadata } from './angular';
import { ngWalkerFactoryUtils } from './angular/ngWalkerFactoryUtils';
import { getClassName } from './util/utils';

type Options = [];
type MessageIds = 'useComponentSelector';

export default util.createRule<Options, MessageIds>({
  name: 'use-component-selector',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Component selector must be declared',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [],
    messages: {
      useComponentSelector: `The selector of the component '{{className}}' is mandatory`,
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
            const {
              decorator: metadataDecorator,
              controller: { name: controllerName },
              selector: metadataSelector,
            } = metadata;

            if (metadataSelector || !controllerName) return;

            context.report({
              node: nodeMaps.tsNodeToESTreeNodeMap.get(metadataDecorator),
              messageId: 'useComponentSelector',
              data: {
                className: controllerName.text,
              },
            });
          }
        }
      },
    };
  },
});
