import { ParserServices } from '@typescript-eslint/parser';
import { ParserServices as TSESTreeParserServices } from '@typescript-eslint/typescript-estree';
import { RuleContext } from 'ts-eslint';

type RequiredParserServices = {
  [k in keyof ParserServices]: Exclude<ParserServices[k], undefined>
};

/**
 * Try to retrieve typescript parser service from context
 */
export function getParserServices<
  TMessageIds extends string,
  TOptions extends any[]
>(context: RuleContext<TMessageIds, TOptions>): RequiredParserServices {
  if (
    !context.parserServices ||
    !context.parserServices.program ||
    !context.parserServices.esTreeNodeToTSNodeMap
  ) {
    /**
     * The user needs to have configured "project" in their parserOptions
     * for @typescript-eslint/parser
     */
    throw new Error(
      'You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.',
    );
  }
  return context.parserServices as RequiredParserServices;
}

type NodeMaps = {
  [k in keyof Pick<
    TSESTreeParserServices,
    'esTreeNodeToTSNodeMap' | 'tsNodeToESTreeNodeMap'
  >]: NonNullable<TSESTreeParserServices[k]>
};

export function getNodeMaps<TMessageIds extends string, TOptions extends any[]>(
  context: RuleContext<TMessageIds, TOptions>,
): NodeMaps {
  if (
    !context.parserServices ||
    !context.parserServices.esTreeNodeToTSNodeMap ||
    !context.parserServices.tsNodeToESTreeNodeMap
  ) {
    /**
     * The user needs to have either configured "project" or "preserveNodeMaps" in their parserOptions
     * for @typescript-eslint/parser
     */
    throw new Error(
      'You have used a rule which requires AST node maps to be preserved during conversion. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser, or set "parserOptions.preserveNodeMaps" to `true`.',
    );
  }
  return {
    esTreeNodeToTSNodeMap: context.parserServices.esTreeNodeToTSNodeMap,
    tsNodeToESTreeNodeMap: context.parserServices.tsNodeToESTreeNodeMap,
  };
}
