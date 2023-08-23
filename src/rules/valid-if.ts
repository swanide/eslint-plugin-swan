/**
 * @file valid-if
 * @author mengke(kekee000@gmail.com)
 */
import type swan from '@swanide/swan-eslint-parser';
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
                        message: `'${prefix}if' 和 '${prefix}else' 不可以设置在同一个标签上`,
                    });
                }

                if (hasDirective(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' 和 '${prefix}elif' 不可以设置在同一个标签上`,
                    });
                }

                if (hasDirective(element, 'else-if')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' 和 '${prefix}else-if' 不可以设置在同一个标签上`,
                    });
                }

                if (!isValidSingleMustacheOrExpression(node.value)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' 值为非空表达式`,
                    });
                }
            },
        });
    },
};
