/**
 * @file filter/sjs name 检查
 * @author mengke01(kekee000@gmail.com)
 */

import type swan from '@baidu/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor, getValueType} from '../utils';

const filterNameReg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate filter/sjs name',
            categories: ['essential'],
            url: getRuleUrl('sjs-name'),
        },
        fixable: null,

        schema: [],
    },

    create(context: RuleContext) {
        return defineTemplateBodyVisitor(context, {
            'XElement'(node: swan.ast.XElement) {
                if (node.name  !== 'filter' && node.name  !== 'import-sjs') {
                    return;
                }

                const attr = node.startTag.attributes.find(a => a.key.name === 'module');
                if (!attr) {
                    context.report({
                        node: node,
                        loc: node.loc,
                        message: `${node.name} 需要设置 module 模块名，并且符合 \'a-zA-Z0-9_\'`,
                    });
                    return;
                }
                // name 必须是 literal
                if (attr.key.name === 'module'
                    && (getValueType(attr) !== 'literal'
                    || !filterNameReg.test((attr.value[0] as swan.ast.XLiteral).value))
                ) {
                    context.report({
                        node: attr,
                        loc: attr.loc,
                        message: `${node.name} module 模块名必须为字符串，并且符合 \'a-zA-Z0-9_\'`,
                    });
                }

            },
        });
    },
};