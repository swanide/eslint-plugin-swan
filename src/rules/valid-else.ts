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
                    || (!hasDirective(prevElement, 'if')
                        && !hasDirective(prevElement, 'elif')
                        && !hasDirective(prevElement, 'else-if'))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' 需要有匹配的 '${prefix}if' 或者 '${prefix}elif'`,
                    });
                }

                if (node.value?.length) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' 不支持设置值`,
                    });
                }

                if (hasDirective(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' 和 '${prefix}elif' 不可以同时设置在标签上`,
                    });
                }

                if (hasDirective(element, 'else-if')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' 和 '${prefix}else-if' 不可以同时设置在标签上`,
                    });
                }
            },
        });
    },
};
