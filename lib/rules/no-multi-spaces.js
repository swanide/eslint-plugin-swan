"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const isProperty = (context, node) => {
    const sourceCode = context.getSourceCode();
    // @ts-ignore
    return node.type === 'Punctuator' && sourceCode.getText(node) === ':';
};
module.exports = {
    meta: {
        type: 'layout',
        docs: {
            description: 'disallow multiple spaces',
            categories: ['essential'],
            url: (0, utils_1.getRuleUrl)('no-multi-spaces'),
        },
        fixable: 'whitespace',
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreProperties: {
                        type: 'boolean',
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = context.options[0] || {};
        const ignoreProperties = options.ignoreProperties === true;
        const sourceCode = context.getSourceCode();
        const tokenStore = context.parserServices.getTemplateBodyTokenStore();
        if (!sourceCode.ast || !sourceCode.ast.templateBody) {
            return {};
        }
        const tokens = tokenStore.getTokens(sourceCode.ast.templateBody, {
            includeComments: true,
        }) || [];
        let prevToken = tokens.shift();
        for (const token of tokens) {
            const spaces = token.range[0] - prevToken.range[1];
            const shouldIgnore = ignoreProperties
                && (isProperty(context, token) || isProperty(context, prevToken));
            if (spaces > 1
                && token.loc.start.line === prevToken.loc.start.line
                && !shouldIgnore) {
                context.report({
                    node: token,
                    loc: {
                        start: prevToken.loc.end,
                        end: token.loc.start,
                    },
                    message: `Multiple spaces found before '${sourceCode.getText(token)}'.`,
                    /* eslint-disable-next-line no-loop-func */
                    fix: fixer => fixer.replaceTextRange([prevToken.range[1], token.range[0]], ' '),
                });
            }
            prevToken = token;
        }
        return {};
    },
};
