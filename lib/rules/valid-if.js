"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.default = {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate if directive',
            categories: ['essential'],
            url: (0, utils_1.getRuleUrl)('valid-if'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            'XDirective[key.name="if"]'(node) {
                const element = node.parent.parent;
                const prefix = node.key.prefix;
                if ((0, utils_1.hasDirective)(element, 'else')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}' and '${prefix}else' directives can't exist on the same element.`,
                    });
                }
                if ((0, utils_1.hasDirective)(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' and '${prefix}elif' directives can't exist on the same element.`,
                    });
                }
                if (!(0, utils_1.isValidSingleMustacheOrExpression)(node.value)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' value should be expression.`,
                    });
                }
            },
        });
    },
};
