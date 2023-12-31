/**
 * @file no-useless-mustache.ts
 * @author mengke01(kekee000@gmail.com)
 */
import type swan from '@swanide/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor} from '../utils';

export default {
    meta: {
        docs: {
            description: 'disallow unnecessary mustache interpolations',
            categories: ['essential'],
            url: getRuleUrl('no-useless-mustache'),
        },
        fixable: 'code',
        schema: [],
        type: 'problem',
    },

    create(context: RuleContext) {

        /**
         * Report if the value expression is string literals
         * @param node the node to check
         */
        function verify(node: swan.ast.XMustache) {
            const {expression} = node.value;
            if (!expression) {
                context.report({
                    node,
                    message: '不允许空的 mustache 表达式',
                    loc: node.loc,
                    fix: fixer => fixer.removeRange(node.range),
                });
                return;
            }
        }

        return defineTemplateBodyVisitor(context, {
            'XMustache': verify,
        });
    },
};
