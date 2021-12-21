"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.default = {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate for directive',
            categories: ['essential'],
            url: (0, utils_1.getRuleUrl)('valid-for'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        const forVisitor = (node) => {
            const { key: { rawName } } = node;
            if (node.value.length > 1 || !(0, utils_1.isValidSingleMustacheOrExpression)(node.value)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' value should be expression.`,
                });
            }
        };
        const forItemVisitor = (node) => {
            const { key: { rawName, prefix } } = node;
            const element = node.parent.parent;
            if (!(0, utils_1.hasDirective)(element, 'for')) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' should has '${prefix}for'.`,
                });
            }
            if (node.value.length !== 1 || node.value[0].type !== 'XExpression') {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' value should be literal text.`,
                });
            }
        };
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            'XDirective[key.name="for"]': forVisitor,
            'XDirective[key.name="for-item"]': forItemVisitor,
            'XDirective[key.name="for-index"]': forItemVisitor,
        });
    },
};
