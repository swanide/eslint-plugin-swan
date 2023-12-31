/**
 * @file xml-indent.js
 * @author mengke(kekee000@gmail.com)
 */

import {defineVisitor} from '../utils/indent-common';
import {getRuleUrl} from '../utils';
import {RuleContext} from '../types/eslint';

export default {

    create(context: RuleContext) {
        if (!context.parserServices.getTemplateBodyTokenStore) {
            return {};
        }

        const tokenStore = context.parserServices.getTemplateBodyTokenStore();
        const visitor = defineVisitor(context, tokenStore, {
            baseIndent: 1,
        });

        return context.parserServices.defineTemplateBodyVisitor(visitor);
    },
    meta: {
        type: 'layout',
        docs: {
            description: 'enforce consistent indentation',
            categories: ['strongly-recommended'],
            url: getRuleUrl('xml-indent'),
        },
        fixable: 'whitespace',
        schema: [
            {
                anyOf: [{type: 'integer', minimum: 1}, {enum: ['tab']}],
            },
            {
                type: 'object',
                properties: {
                    attribute: {type: 'integer', minimum: 0},
                    baseIndent: {type: 'integer', minimum: 0},
                    scriptBaseIndent: {type: 'integer', minimum: 0},
                    closeBracket: {
                        anyOf: [
                            {type: 'integer', minimum: 0},
                            {
                                type: 'object',
                                properties: {
                                    startTag: {type: 'integer', minimum: 0},
                                    endTag: {type: 'integer', minimum: 0},
                                    selfClosingTag: {type: 'integer', minimum: 0},
                                },
                                additionalProperties: false,
                            },
                        ],
                    },
                    switchCase: {type: 'integer', minimum: 0},
                    alignAttributesVertically: {type: 'boolean'},
                    ignores: {
                        type: 'array',
                        items: {
                            allOf: [
                                {type: 'string'},
                                {not: {type: 'string', pattern: ':exit$'}},
                                {not: {type: 'string', pattern: '^\\s*$'}},
                            ],
                        },
                        uniqueItems: true,
                        additionalItems: false,
                    },
                },
                additionalProperties: false,
            },
        ],
    },
};
