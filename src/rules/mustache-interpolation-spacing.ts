/**
 * @fileoverview enforce unified spacing in mustache interpolations.
 * @author Armano
 */
import type estree from 'estree';
import type swan from '@baidu/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor} from '../utils';

export default {
    meta: {
        type: 'layout',
        docs: {
            description: 'enforce unified spacing in mustache interpolations',
            categories: ['essential'],
            url: getRuleUrl('mustache-interpolation-spacing'),
        },
        fixable: 'whitespace',
        schema: [
            {
                enum: ['always', 'never'],
            },
        ],
    },

    create(context: RuleContext) {
        const options = context.options[0] || 'always';
        const tokenStore = context.parserServices.getTemplateBodyTokenStore
                            && context.parserServices.getTemplateBodyTokenStore();

        return defineTemplateBodyVisitor(context, {
            'XMustache[value!=null]'(node: swan.ast.XMustache) {
                const openBrace = tokenStore.getFirstToken(node);
                const closeBrace = tokenStore.getLastToken(node);
                if (!openBrace
                    || !closeBrace
                    || openBrace.type !== 'XMustacheStart'
                    || closeBrace.type !== 'XMustacheEnd'
                ) {
                    return;
                }

                const firstToken = tokenStore.getTokenAfter(openBrace, {
                    includeComments: true,
                });
                const lastToken = tokenStore.getTokenBefore(closeBrace, {
                    includeComments: true,
                });

                if (options === 'always') {
                    if (openBrace.range[1] === firstToken.range[0]) {
                        context.report({
                            node: openBrace,
                            message: 'Expected 1 space after \'{{\', but not found.',
                            fix: fixer => fixer.insertTextAfter(openBrace as estree.Node, ' '),
                        });
                    }
                    if (closeBrace.range[0] === lastToken.range[1]) {
                        context.report({
                            node: closeBrace,
                            message: 'Expected 1 space before \'}}\', but not found.',
                            fix: fixer => fixer.insertTextBefore(closeBrace as estree.Node, ' '),
                        });
                    }
                }
                else {
                    if (openBrace.range[1] !== firstToken.range[0]) {
                        context.report({
                            loc: {
                                start: openBrace.loc.start,
                                end: firstToken.loc.start,
                            },
                            message: 'Expected no space after \'{{\', but found.',
                            fix: fixer =>
                                fixer.removeRange([openBrace.range[1], firstToken.range[0]]),
                        });
                    }
                    if (closeBrace.range[0] !== lastToken.range[1]) {
                        context.report({
                            loc: {
                                start: lastToken.loc.end,
                                end: closeBrace.loc.end,
                            },
                            message: 'Expected no space before \'}}\', but found.',
                            fix: fixer =>
                                fixer.removeRange([lastToken.range[1], closeBrace.range[0]]),
                        });
                    }
                }
            },
        });
    },
};
