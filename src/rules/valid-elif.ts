/**
 * @file valid-elif.ts
 * @author mengke01(kekee000@gmail.com)
 */
import type swan from '@swanide/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {
    getRuleUrl,
    defineTemplateBodyVisitor,
    getPrevNode, hasDirective,
    isValidSingleMustacheOrExpression,
} from '../utils';

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate elif directive',
            categories: ['essential'],
            url: getRuleUrl('valid-elif'),
        },
        fixable: null,

        schema: [],
    },

    create(context: RuleContext) {

        function verify(node: swan.ast.XDirective) {
            const element = node.parent.parent;
            const {prefix, name} = node.key;
            const prevElement = getPrevNode(element);

            if (!prevElement || prevElement.type !== 'XElement'
                || (!hasDirective(prevElement, 'if')
                    && !hasDirective(prevElement, 'elif')
                    && !hasDirective(prevElement, 'else-if'))) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${prefix}${name}' 找不到匹配的 '${prefix}if' 或者 '${prefix}elif'`,
                });
            }

            if (!isValidSingleMustacheOrExpression(node.value)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${prefix}${name}' 值不正确`,
                });
            }
        }

        return defineTemplateBodyVisitor(context, {
            'XDirective[key.name="elif"]': verify,
            'XDirective[key.name="else-if"]': verify,
        });
    },
};
