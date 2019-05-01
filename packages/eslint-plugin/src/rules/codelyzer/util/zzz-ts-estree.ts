import { TSESTree } from '@typescript-eslint/typescript-estree';

export function isCallExpression(
  node: TSESTree.Node,
): node is TSESTree.CallExpression {
  return node.type === 'CallExpression';
}

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === 'Identifier';
}

export function isMemberExpression(
  node: TSESTree.Node,
): node is TSESTree.MemberExpression {
  return node.type === 'MemberExpression';
}
