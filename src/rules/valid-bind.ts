/**
 * @file valid-bind
 * @author mengke(kekee000@gmail.com)
 */

import type swan from '@swanide/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor, isIdentifierExpression, isValidSingleMustache} from '../utils';

const eventDiretives = ['bind', 'catch', 'capture-bind', 'capture-catch'];

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate bind directive',
            categories: ['essential'],
            url: getRuleUrl('valid-bind'),
        },
        fixable: null,
        schema: [],
    },

    create(context: RuleContext) {

        return defineTemplateBodyVisitor(context, {
            'XDirective'(node: swan.ast.XDirective) {
                if (!eventDiretives.includes(node.key.prefix)) {
                    return;
                }

                if (!node.key.name) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${node.key.rawName}' 需要绑定事件名称`,
                    });
                }
                const isMustacheValue = node.value[0]?.type === 'XMustache';
                if (
                    !(isMustacheValue
                        ? isValidSingleMustache(node.value)
                        : isIdentifierExpression(node.value)
                    )
                ) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${node.key.rawName}' 值设置不正确`,
                    });
                }
            },
        });
    },
};
