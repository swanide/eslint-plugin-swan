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
    getDirective,
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

        schema: [
            {
                type: 'object',
                properties: {
                    ignoreDuplicateForItem: {
                        type: 'boolean',
                    },
                },
            },
        ],
    },

    create(context: RuleContext) {
        const options = context.options[0] || {};
        const ignoreDuplicateForItem = options.ignoreDuplicateForItem === true;

        const forVisitor = (node: swan.ast.XDirective) => {
            const {key: {rawName}} = node;

            if (node.value.length > 1 || !isValidSingleMustacheOrExpression(node.value)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' 值为非空表达式`,
                });
            }
        };

        const forItemVisitor = (node: swan.ast.XDirective) => {
            const {key: {rawName, prefix}} = node;
            const element = node.parent.parent;
            const hasFor = hasDirective(element, 'for');
            if (!hasFor) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' 需要有匹配的 '${prefix}for'`,
                });
            }
            else if (!ignoreDuplicateForItem) {
                const forValues = getDirective(element, 'for').value;
                // s-for="item, index in list"
                if (forValues[0]?.type === 'XExpression') {
                    const forValue = forValues[0].expression as swan.ast.SwanForExpression;
                    if (forValue.left && node.key.name === 'for-item') {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `'${rawName}' 和 '${prefix}for' 重复定义`,
                        });
                    }
                    if (forValue.index && node.key.name === 'for-index') {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `'${rawName}' 和 '${prefix}for' 重复定义`,
                        });
                    }
                }
            }

            if (node.value.length !== 1
                || node.value[0].type !== 'XExpression'
                || node.value[0].expression?.type !== 'Identifier') {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' 值需要是合法变量`,
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
