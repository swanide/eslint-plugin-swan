"use strict";
/**
 * @file valid-bind
 * @author mengke(kekee000@gmail.com)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const eventDiretives = ['bind', 'catch', 'capture-bind', 'capture-catch'];
exports.default = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'validate bind directive',
            categories: ['essential'],
            url: (0, utils_1.getRuleUrl)('valid-bind'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            'XDirective'(node) {
                var _a;
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
                const isMustacheValue = ((_a = node.value) === null || _a === void 0 ? void 0 : _a[0].type) === 'XMustache';
                if (!(isMustacheValue
                    ? (0, utils_1.isValidSingleMustache)(node.value)
                    : (0, utils_1.isIdentifierExpression)(node.value))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${node.key.rawName}' value should be 'literal' or mustache'.`,
                    });
                }
            },
        });
    },
};
