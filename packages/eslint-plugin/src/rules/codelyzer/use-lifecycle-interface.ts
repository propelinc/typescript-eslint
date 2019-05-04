import * as ts from 'typescript';
import * as util from '../../util';
import { getNodeMaps } from '../../util';
import { getDeclaredMethods } from './util/classDeclarationUtils';
import {
  AngularLifecycleInterfaces,
  getDeclaredAngularLifecycleInterfaces,
  getLifecycleInterfaceByMethodName,
  isAngularLifecycleMethod,
} from './util/utils';

type Options = [];
type MessageIds = 'useLifecycleInterface';

const STYLE_GUIDE_LINK = 'https://angular.io/styleguide#style-09-01';

export default util.createRule<Options, MessageIds>({
  name: 'use-lifecycle-interface',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Ensures classes implement lifecycle interfaces corresponding to the declared lifecycle methods',
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
      useLifecycleInterface: `Lifecycle interface '{{interfaceName}}' should be implemented for method '{{methodName}}'. (${STYLE_GUIDE_LINK})`,
    },
  },
  defaultOptions: [],
  create(context) {
    const nodeMaps = getNodeMaps(context);

    return {
      ClassDeclaration(node) {
        const tsNode = nodeMaps.esTreeNodeToTSNodeMap.get<ts.ClassDeclaration>(
          node,
        );

        const declaredLifecycleInterfaces = getDeclaredAngularLifecycleInterfaces(
          tsNode,
        );
        const declaredMethods = getDeclaredMethods(tsNode);

        for (const method of declaredMethods) {
          const { name: methodProperty } = method;
          const methodName = methodProperty.getText();

          if (!isAngularLifecycleMethod(methodName)) continue;

          const interfaceName = getLifecycleInterfaceByMethodName(methodName);
          const isMethodImplemented = declaredLifecycleInterfaces.includes(
            AngularLifecycleInterfaces[interfaceName],
          );

          if (isMethodImplemented) continue;

          context.report({
            node: nodeMaps.tsNodeToESTreeNodeMap.get(methodProperty),
            messageId: 'useLifecycleInterface',
            data: {
              interfaceName,
              methodName,
            },
          });
        }
      },
    };
  },
});
