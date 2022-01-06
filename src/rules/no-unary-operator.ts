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

        function verify(node: UnaryExpression) {
            if (node.operator === '+') {
                context.report({
                    node,
                    message: '在版本低于 3.230.0 的基础库上不支持一元表达式 \'+\'',
                    loc: node.loc,
                    fix: null,
                });
                return;
            }
        }

        return defineTemplateBodyVisitor(context, {
            'XMustache>XExpression UnaryExpression': verify,
            'XDirective>XExpression UnaryExpression': verify,
        });
    },
};
