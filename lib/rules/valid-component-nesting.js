"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const component_1 = require("../utils/component");
function isSelfClose(node) {
    if (!node.children.length) {
        return true;
    }
    return node.children.every(i => i.type === 'XText' && /^\s*$/.test(i.value));
}
function getInlineParent(node) {
    while (node && node.type !== 'XDocument') {
        if (component_1.inlineComponents.includes(node.name)) {
            return node;
        }
        node = node.parent;
    }
    return null;
}
function isAtTopLevel(node) {
    if (!node.parent || node.parent.type === 'XDocument') {
        return true;
    }
    return false;
}
exports.default = {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate component nesting',
            categories: ['essential'],
            url: (0, utils_1.getRuleUrl)('valid-component-nesting'),
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
                            allOf: [{ type: 'string' }],
                        },
                        uniqueItems: true,
                    },
                },
            },
        ],
    },
    create(context) {
        const { allowEmptyBlock = false, ignoreEmptyBlock = ['view'] } = context.options[0] || {};
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            'XElement'(node) {
                if (component_1.selfCloseComponents.includes(node.name) && !isSelfClose(node)) {
                    context.report({
                        node: node,
                        loc: node.loc,
                        message: 'self close component shouldn\'t have children.',
                    });
                }
                // import-sjs has src attribute is self close
                if (node.name === 'import-sjs' && (0, utils_1.hasAttribute)(node, 'src') && !isSelfClose(node)) {
                    context.report({
                        node: node,
                        loc: node.loc,
                        message: '\'import-sjs\' with \'src\' shouldn\'t have children.',
                    });
                }
                if (component_1.topLevelCompoents.includes(node.name) && !isAtTopLevel(node)) {
                    if (node.name === 'template' && (0, utils_1.hasAttribute)(node, 'is')) {
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
                if ((component_1.blockComponents.includes(node.name) || component_1.inlineBlockComponents.includes(node.name))) {
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
                        && !component_1.selfCloseComponents.includes(node.name)
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
