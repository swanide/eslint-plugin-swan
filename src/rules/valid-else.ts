/**
 * @file valid-else.ts
 * @author mengke01(kekee000@gmail.com)
 */
import type swan from '@baidu/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor, getPrevNode, hasDirective} from '../utils';

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate else directive',
            categories: ['essential'],
            url: getRuleUrl('valid-else'),
        },
        fixable: null,

        schema: [],
    },

    create(context: RuleContext) {

        return defineTemplateBodyVisitor(context, {

            'XDirective[key.name="else"]'(node: swan.ast.XDirective) {
                const element = node.parent.parent;
                const {prefix} = node.key;
                const prevElement = getPrevNode(element);

                if (!prevElement || prevElement.type !== 'XElement'
                    || (!hasDirective(element, 'if') && hasDirective(element, 'elif'))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' should follow with '${prefix}if' or '${prefix}elif'.`,
                    });
                }

                if (node.value?.length) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' should have no value.`,
                    });
                }


                if (hasDirective(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' and '${prefix}elif' directives can't exist on the same element.`,
                    });
                }
            },
        });
    },
};
