"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.default = {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate else directive',
            categories: ['essential'],
            url: (0, utils_1.getRuleUrl)('valid-else'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            'XDirective[key.name="else"]'(node) {
                var _a;
                const element = node.parent.parent;
                const { prefix } = node.key;
                const prevElement = (0, utils_1.getPrevNode)(element);
                if (!prevElement || prevElement.type !== 'XElement'
                    || (!(0, utils_1.hasDirective)(element, 'if') && (0, utils_1.hasDirective)(element, 'elif'))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' should follow with '${prefix}if' or '${prefix}elif'.`,
                    });
                }
                if ((_a = node.value) === null || _a === void 0 ? void 0 : _a.length) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' should have no value.`,
                    });
                }
                if ((0, utils_1.hasDirective)(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' and '${prefix}elif' directives can't exist on the same element.`,
                    });
                }
            },
        });
    },
};
