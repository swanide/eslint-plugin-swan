/**
 * @file valid-for
 * @author mengke(kekee000@gmail.com)
 */
import type swan from '@baidu/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {
    getRuleUrl,
    defineTemplateBodyVisitor,
    hasDirective,
    isValidSingleMustacheOrExpression,
} from '../utils';

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate for directive',
            categories: ['essential'],
            url: getRuleUrl('valid-for'),
        },
        fixable: null,

        schema: [],
    },

    create(context: RuleContext) {
        const forVisitor = (node: swan.ast.XDirective) => {
            const {key: {rawName}} = node;

            if (node.value.length > 1 || !isValidSingleMustacheOrExpression(node.value)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' value should be expression.`,
                });
            }
        };

        const forItemVisitor = (node: swan.ast.XDirective) => {
            const {key: {rawName, prefix}} = node;
            const element = node.parent.parent;

            if (!hasDirective(element, 'for')) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' should has '${prefix}for'.`,
                });
            }

            if (node.value.length !== 1 || node.value[0].type !== 'XExpression') {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' value should be literal text.`,
                });
            }
        };

        return defineTemplateBodyVisitor(context, {
            'XDirective[key.name="for"]': forVisitor,
            'XDirective[key.name="for-item"]': forItemVisitor,
            'XDirective[key.name="for-index"]': forItemVisitor,
        });
    },
};
