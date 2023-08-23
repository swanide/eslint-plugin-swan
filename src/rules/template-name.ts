/**
 * @file template name 检查
 * @author mengke01(kekee000@gmail.com)
 */

import type swan from '@swanide/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor, getValueType} from '../utils';

const templateNameReg = /^[a-zA-Z0-9_-]+$/;

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate template name',
            categories: ['essential'],
            url: getRuleUrl('template-name'),
        },
        fixable: null,

        schema: [],
    },

    create(context: RuleContext) {
        return defineTemplateBodyVisitor(context, {
            'XElement'(node: swan.ast.XElement) {
                if (node.name !== 'template') {
                    return;
                }

                const attr = node.startTag.attributes.find(a => a.key.name === 'name' || a.key.name === 'is');
                if (!attr) {
                    return;
                }
                // name 必须是 literal
                if (attr.key.name === 'name'
                    && (getValueType(attr) !== 'literal'
                    || !templateNameReg.test((attr.value[0] as swan.ast.XLiteral).value))
                ) {
                    context.report({
                        node: attr,
                        loc: attr.loc,
                        message: 'template name 名称必须为字符串，并且符合 \'a-zA-Z0-9_-\'',
                    });
                }
                else if (attr.key.name === 'is'
                    && getValueType(attr) === 'literal'
                    && !templateNameReg.test((attr.value[0] as swan.ast.XLiteral).value)
                ) {
                    context.report({
                        node: attr,
                        loc: attr.loc,
                        message: 'template is 需要符合 \'a-zA-Z0-9_-\'',
                    });
                }

            },
        });
    },
};