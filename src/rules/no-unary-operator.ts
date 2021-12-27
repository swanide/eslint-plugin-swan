/**
 * @file mustache 禁止使用一元运算符
 * @author mengke01(kekee000@gmail.com)
 */
import {UnaryExpression} from 'estree';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor} from '../utils';

export default {
    meta: {
        docs: {
            description: 'disallow unary-operator in mustache interpolations',
            categories: ['essential'],
            url: getRuleUrl('no-unary-operator'),
        },
        fixable: 'code',
        schema: [],
        type: 'problem',
    },

    create(context: RuleContext) {

        return defineTemplateBodyVisitor(context, {
            'XMustache>XExpression UnaryExpression'(node: UnaryExpression) {
                if (node.operator === '+' || node.operator === '-') {
                    context.report({
                        node,
                        message: 'Unexpected mustache interpolation not support unary operator.',
                        loc: node.loc,
                        fix: null,
                    });
                    return;
                }
            },
        });
    },
};
