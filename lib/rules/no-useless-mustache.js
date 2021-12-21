"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function stripQuotesForHTML(text) {
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    if ((text[0] === '"' || text[0] === '\'' || text[0] === '`') && text[0] === text[text.length - 1]) {
        return text.slice(1, -1);
    }
    return null;
}
exports.default = {
    meta: {
        docs: {
            description: 'disallow unnecessary mustache interpolations',
            categories: ['essential'],
            url: (0, utils_1.getRuleUrl)('no-useless-mustache'),
        },
        fixable: 'code',
        messages: {
            unexpected: 'Unexpected mustache interpolation with a string literal value.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreIncludesComment: {
                        type: 'boolean',
                    },
                    ignoreStringEscape: {
                        type: 'boolean',
                    },
                },
            },
        ],
        type: 'suggestion',
    },
    create(context) {
        const opts = context.options[0] || {};
        const { ignoreIncludesComment } = opts;
        const { ignoreStringEscape } = opts;
        /**
         * Report if the value expression is string literals
         * @param node the node to check
         */
        function verify(node) {
            const { expression } = node.value;
            const sourceCode = context.getSourceCode();
            const content = sourceCode.getText().slice(node.range[0], node.range[1]);
            if (!expression) {
                if (content.search(/^\{\{\s*\}\}$/) !== -1) {
                    context.report({
                        node,
                        message: 'Unexpected empty mustache interpolation.',
                        loc: node.loc,
                        fix: fixer => fixer.removeRange(node.range),
                    });
                }
                return;
            }
            let strValue = '';
            let rawValue = '';
            if (expression.type === 'Literal') {
                if (typeof expression.value !== 'string') {
                    return;
                }
                strValue = expression.value;
                rawValue = expression.raw;
            }
            else if (expression.type === 'TemplateLiteral') {
                if (expression.expressions.length > 0) {
                    return;
                }
                strValue = expression.quasis[0].value.cooked;
                rawValue = expression.quasis[0].value.raw;
            }
            else {
                return;
            }
            const tokenStore = context.parserServices.getTemplateBodyTokenStore();
            const hasComment = tokenStore
                .getTokens(node, { includeComments: true })
                .some(t => t.type === 'Block' || t.type === 'Line');
            if (ignoreIncludesComment && hasComment) {
                return;
            }
            let hasEscape = false;
            if (rawValue !== strValue) {
                // check escapes
                const chars = [...rawValue];
                let c = chars.shift();
                while (c) {
                    if (c === '\\') {
                        c = chars.shift();
                        // ignore "\\", '"', "'", "`" and "$"
                        if (c == null || 'nrvtbfux'.includes(c)) {
                            // has useful escape.
                            hasEscape = true;
                            break;
                        }
                    }
                    c = chars.shift();
                }
            }
            if (ignoreStringEscape && hasEscape) {
                return;
            }
            context.report({
                node,
                messageId: 'unexpected',
                loc: node.loc,
                fix(fixer) {
                    if (hasComment || hasEscape) {
                        // cannot fix
                        return null;
                    }
                    // @ts-ignore
                    const text = expression.raw ? stripQuotesForHTML(expression.raw) : null;
                    if (text == null) {
                        // unknowns
                        return null;
                    }
                    if (text.includes('\n') || /^\s|\s$/u.test(text)) {
                        // It doesn't autofix because another rule like indent or eol space might remove spaces.
                        return null;
                    }
                    // @ts-ignore
                    return fixer.replaceText(node, text.replace(/\\([\s\S])/g, '$1'));
                },
            });
        }
        return (0, utils_1.defineTemplateBodyVisitor)(context, {
            'XElement > XMustache': verify,
            'XAttribute,XDirective > XMustache': verify,
        });
    },
};
