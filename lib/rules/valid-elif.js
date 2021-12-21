"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.default = {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate elif directive',
            categories: ['essential'],
            url: (0, utils_1.getRuleUrl)('valid-elif'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            'XDirective[key.name="elif"]'(node) {
                const element = node.parent.parent;
                const { prefix } = node.key;
                const prevElement = (0, utils_1.getPrevNode)(element);
                if (!prevElement || prevElement.type !== 'XElement'
                    || (!(0, utils_1.hasDirective)(element, 'if') && !(0, utils_1.hasDirective)(element, 'elif'))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}elif' should follow with '${prefix}if' or '${prefix}elif'.`,
                    });
                }
                if (!(0, utils_1.isValidSingleMustacheOrExpression)(node.value)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}elif' value should be expression.`,
                    });
                }
            },
        });
    },
};
