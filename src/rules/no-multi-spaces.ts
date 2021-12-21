/**
 * @file no-multi-spaces
 * @author mengke01(kekee000@gmail.com)
 */
import type swan from '@baidu/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl} from '../utils';

const isProperty = (context: RuleContext, node: swan.ast.Token) => {
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
            url: getRuleUrl('no-multi-spaces'),
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

    create(context: RuleContext) {
        const options = context.options[0] || {};
        const ignoreProperties = options.ignoreProperties === true;

        const sourceCode = context.getSourceCode();
        const tokenStore = context.parserServices.getTemplateBodyTokenStore();
        if (!sourceCode.ast || !(sourceCode.ast as swan.ast.ScriptProgram).templateBody) {
            return {};
        }
        const tokens = tokenStore.getTokens((sourceCode.ast as swan.ast.ScriptProgram).templateBody, {
            includeComments: true,
        }) || [];

        let prevToken = tokens.shift();
        for (const token of tokens) {
            const spaces = token.range[0] - prevToken.range[1];
            const shouldIgnore = ignoreProperties
                && (isProperty(context, token) || isProperty(context, prevToken));

            if (spaces > 1
                && token.loc.start.line === prevToken.loc.start.line
                && !shouldIgnore
            ) {
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
