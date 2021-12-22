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

        schema: [],
    },

    create(context: RuleContext) {
        const forVisitor = (node: swan.ast.XDirective) => {
            const {key: {rawName}} = node;

            if (node.value.length > 1 || !isValidSingleMustacheOrExpression(node.value)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' value should be expression.`,
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
                    message: `'${rawName}' should has '${prefix}for'.`,
                });
            }
            else {
                const forValues = getDirective(element, 'for').value;
                // s-for="item, index in list"
                if (forValues[0]?.type === 'XExpression') {
                    const forValue = forValues[0].expression as swan.ast.SwanForExpression;
                    if (forValue.left && node.key.name === 'for-item') {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `'${rawName}' duplicate with '${prefix}for'.`,
                        });
                    }
                    if (forValue.index && node.key.name === 'for-index') {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `'${rawName}' duplicate with '${prefix}for'.`,
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
                    message: `'${rawName}' value should be literal text.`,
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
