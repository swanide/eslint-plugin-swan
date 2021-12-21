"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.default = {
    meta: {
        docs: {
            description: 'enforce end tag style',
            categories: ['essential'],
            url: (0, utils_1.getRuleUrl)('html-end-tag'),
        },
        fixable: 'code',
        messages: {
            unexpected: 'missing end tag',
        },
        schema: [],
    },
    create(context) {
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            'XElement'(node) {
                const { name } = node;
                const isSelfClosing = node.startTag.selfClosing;
                const hasEndTag = node.endTag != null;
                if (!hasEndTag && !isSelfClosing) {
                    context.report({
                        node: node.startTag,
                        loc: node.startTag.loc,
                        message: '\'<{{name}}>\' should have end tag.',
                        data: { name },
                    });
                }
            },
        });
    },
};
