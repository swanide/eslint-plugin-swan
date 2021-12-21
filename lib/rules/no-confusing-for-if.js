"use strict";
/**
 * @file no-confusing-for-if.ts
 * @author mengke01(kekee000@gmail.com)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function getRefs(node) {
    return node
        ? node.value
            .filter(i => { var _a; return i.type === 'XMustache' && ((_a = i.value) === null || _a === void 0 ? void 0 : _a.references) || i.type === 'XExpression' && i.references; })
            .reduce((references, node) => references.concat(node.type === 'XMustache'
            ? node.value.references
            : node.references), [])
        : [];
}
function getLiteralRefs(node) {
    return node
        ? node.value
            .filter(i => i.type === 'XLiteral')
            .reduce((references, node) => references.concat(node.value), [])
        : [];
}
exports.default = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow confusing `for` and `if` directive on the same element',
            categories: ['essential'],
            url: (0, utils_1.getRuleUrl)('no-confusing-for-if'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            'XDirective[key.name=\'if\']'(node) {
                const element = node.parent.parent;
                const prefix = node.key.prefix;
                if ((0, utils_1.hasDirective)(element, 'for') || (0, utils_1.hasDirective)(element, 'for-items')) {
                    const forItemNode = (0, utils_1.getDirective)(element, 'for-item');
                    const ifRefs = getRefs(node);
                    const forRefs = forItemNode
                        ? getLiteralRefs(forItemNode)
                        : ['item'];
                    const isRefMatches = ifRefs.some(ref => forRefs.some(variable => variable === ref.id.name));
                    if (isRefMatches) {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `'${prefix}if' should move to the wrapper element.`,
                        });
                    }
                }
            },
        });
    },
};
