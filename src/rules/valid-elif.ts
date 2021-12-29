/**
 * @file valid-elif.ts
 * @author mengke01(kekee000@gmail.com)
 */
import type swan from '@baidu/swan-eslint-parser';
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

        return defineTemplateBodyVisitor(context, {
            'XDirective[key.name="elif"]'(node: swan.ast.XDirective) {
                const element = node.parent.parent;
                const {prefix} = node.key;
                const prevElement = getPrevNode(element);

                if (!prevElement || prevElement.type !== 'XElement'
                    || (!hasDirective(element, 'if') && !hasDirective(element, 'elif'))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}elif' 找不到匹配的 '${prefix}if' 或者 '${prefix}elif'.`,
                    });
                }

                if (!isValidSingleMustacheOrExpression(node.value)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}elif' 值不正确`,
                    });
                }
            },
        });
    },
};
