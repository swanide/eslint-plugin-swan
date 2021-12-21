/**
 * @file no-confusing-for-if.ts
 * @author mengke01(kekee000@gmail.com)
 */

import type swan from '@baidu/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor, hasDirective, getDirective} from '../utils';


function getRefs(node: swan.ast.XAttribute | swan.ast.XDirective) {
    return node
        ? node.value
            .filter(i => i.type === 'XMustache' && i.value?.references || i.type === 'XExpression' && i.references)
            .reduce((references, node) =>
                references.concat(
                    node.type === 'XMustache'
                        ? node.value.references
                        : (node as swan.ast.XExpression).references
                ),
            [])
        : [];
}

function getLiteralRefs(node: swan.ast.XAttribute | swan.ast.XDirective) {
    return node
        ? node.value
            .filter(i => i.type === 'XLiteral')
            .reduce((references, node) => references.concat((node as swan.ast.XLiteral).value), [])
        : [];
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow confusing `for` and `if` directive on the same element',
            categories: ['essential'],
            url: getRuleUrl('no-confusing-for-if'),
        },
        fixable: null,
        schema: [],
    },

    create(context: RuleContext) {
        return defineTemplateBodyVisitor(context, {
            'XDirective[key.name=\'if\']'(node: swan.ast.XDirective) {
                const element = node.parent.parent;
                const prefix = node.key.prefix;
                if (hasDirective(element, 'for') || hasDirective(element, 'for-items')) {
                    const forItemNode = getDirective(element, 'for-item');
                    const ifRefs = getRefs(node);
                    const forRefs = forItemNode
                        ? getLiteralRefs(forItemNode)
                        : ['item'];
                    const isRefMatches = ifRefs.some(ref => forRefs.some(variable => variable === ref.id.name));
                    if (isRefMatches) {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `'${prefix}if' should move to the wrapper element.`,
                        });
                    }
                }
            },
        });
    },
};
