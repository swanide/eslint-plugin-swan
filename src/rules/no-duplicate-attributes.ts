/**
 * @file no-duplicate-attributes.ts
 * @author mengke01(kekee000@gmail.com)
 */

import type swan from '@baidu/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor} from '../utils';


export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow duplication of attributes',
            categories: ['essential'],
            url: getRuleUrl('no-duplicate-attributes'),
        },
        fixable: null,

        schema: [],
    },

    create(context: RuleContext) {

        const directiveNames = new Set();

        return defineTemplateBodyVisitor(context, {
            XStartTag() {
                directiveNames.clear();
            },
            XDirective(node: swan.ast.XDirective) {
                if (node.key.name == null) {
                    return;
                }
                const name = `${node.key.prefix}${node.key.name}`;
                if (directiveNames.has(name)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: '\'{{name}}\' 属性名重复',
                        data: {name},
                    });
                }

                directiveNames.add(name);
            },
        });
    },
};