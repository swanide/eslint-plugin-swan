/**
 * @file valid-component-nesting.ts
 * @author mengke01(kekee000@gmail.com)
 */
import type swan from '@baidu/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor, hasAttribute} from '../utils';

import {
    selfCloseComponents,
    blockComponents,
    inlineBlockComponents,
    inlineComponents,
    topLevelCompoents,
} from '../utils/component';

function isSelfClose(node: swan.ast.XElement) {
    if (!node.children.length) {
        return true;
    }
    return node.children.every(i => i.type === 'XText' && /^\s*$/.test(i.value));
}

function getInlineParent(node: swan.ast.XElement | swan.ast.XDocument) {
    while (node && node.type !== 'XDocument') {
        if (inlineComponents.includes(node.name)) {
            return node;
        }
        node = node.parent;
    }
    return null;
}

function isAtTopLevel(node: swan.ast.XElement) {
    if (!node.parent || node.parent.type === 'XDocument') {
        return true;
    }
    return false;
}

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate component nesting',
            categories: ['essential'],
            url: getRuleUrl('valid-component-nesting'),
        },
        fixable: null,

        schema: [
            {
                type: 'object',
                properties: {
                    allowEmptyBlock: {
                        type: 'boolean',
                    },
                    ignoreEmptyBlock: {
                        type: 'array',
                        items: {
                            allOf: [{type: 'string'}],
                        },
                        uniqueItems: true,
                    },
                },
            },
        ],
    },
    create(context: RuleContext) {
        const {allowEmptyBlock = false, ignoreEmptyBlock = ['view']} = context.options[0] || {};

        return defineTemplateBodyVisitor(context, {

            'XElement'(node: swan.ast.XElement) {
                if (selfCloseComponents.includes(node.name) && !isSelfClose(node)) {
                    context.report({
                        node: node,
                        loc: node.loc,
                        message: 'self close component shouldn\'t have children.',
                    });
                }

                // import-sjs has src attribute is self close
                if (node.name === 'import-sjs' && hasAttribute(node, 'src') && !isSelfClose(node)) {
                    context.report({
                        node: node,
                        loc: node.loc,
                        message: '\'import-sjs\' with \'src\' shouldn\'t have children.',
                    });
                }

                if (topLevelCompoents.includes(node.name) && !isAtTopLevel(node)) {
                    if (node.name === 'template' && hasAttribute(node, 'is')) {
                        // do nothing
                    }
                    else {
                        context.report({
                            node: node,
                            loc: node.loc,
                            message: 'top level component shouldn\'t nested in other component.',
                        });
                    }
                }

                if ((blockComponents.includes(node.name) || inlineBlockComponents.includes(node.name))) {
                    const parent = getInlineParent(node);
                    if (parent) {
                        context.report({
                            node: node,
                            loc: node.loc,
                            message: 'component \'{{name}}\' shouldn\'t nested in component \'{{parentName}}\'.',
                            data: {
                                name: node.name,
                                parentName: parent.name,
                            },
                        });
                    }

                    // not allow empty block
                    if (!allowEmptyBlock
                        && !ignoreEmptyBlock.includes(node.name)
                        && !selfCloseComponents.includes(node.name)
                        && isSelfClose(node)) {
                        context.report({
                            node: node,
                            loc: node.loc,
                            message: 'component \'{{name}}\' should have children.',
                            data: {
                                name: node.name,
                            },
                        });
                    }
                }
            },
        });
    },
};
