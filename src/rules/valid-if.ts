/**
 * @file valid-if
 * @author mengke(kekee000@gmail.com)
 */
import type swan from '@baidu/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor, hasDirective, isValidSingleMustacheOrExpression} from '../utils';

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate if directive',
            categories: ['essential'],
            url: getRuleUrl('valid-if'),
        },
        fixable: null,

        schema: [],
    },
    create(context: RuleContext) {

        return defineTemplateBodyVisitor(context, {
            'XDirective[key.name="if"]'(node: swan.ast.XDirective) {
                const element = node.parent.parent;
                const prefix = node.key.prefix;
                if (hasDirective(element, 'else')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}' and '${prefix}else' directives can't exist on the same element.`,
                    });
                }
                if (hasDirective(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' and '${prefix}elif' directives can't exist on the same element.`,
                    });
                }

                if (!isValidSingleMustacheOrExpression(node.value)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' value should be expression.`,
                    });
                }
            },
        });
    },
};
