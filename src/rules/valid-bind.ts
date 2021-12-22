/**
 * @file valid-bind
 * @author mengke(kekee000@gmail.com)
 */

import type swan from '@baidu/swan-eslint-parser';
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
                        message: `'${node.key.rawName}' should have event name.`,
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
                        message: `'${node.key.rawName}' value should be 'literal' or 'mustache'.`,
                    });
                }
            },
        });
    },
};
