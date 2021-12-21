"use strict";
/**
 * @file no-duplicate-attributes.ts
 * @author mengke01(kekee000@gmail.com)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.default = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow duplication of attributes',
            categories: ['essential'],
            url: (0, utils_1.getRuleUrl)('no-duplicate-attributes'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        const directiveNames = new Set();
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            XStartTag() {
                directiveNames.clear();
            },
            XDirective(node) {
                if (node.key.name == null) {
                    return;
                }
                const name = `${node.key.prefix}${node.key.name}`;
                if (directiveNames.has(name)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: 'Duplicate directive \'{{name}}\'.',
                        data: { name },
                    });
                }
                directiveNames.add(name);
            },
        });
    },
};
