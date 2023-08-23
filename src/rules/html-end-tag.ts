/**
 * @file 闭合标签
 * @author mengke01(kekee000@gmail.com)
 */
import type swan from '@swanide/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl, defineTemplateBodyVisitor} from '../utils';


export default {
    meta: {
        docs: {
            description: 'enforce end tag style',
            categories: ['essential'],
            url: getRuleUrl('html-end-tag'),
        },
        fixable: 'code',
        messages: {
            unexpected: '没有结束标签',
        },
        schema: [],
    },

    create(context: RuleContext) {

        return defineTemplateBodyVisitor(context,
            {

                'XElement'(node: swan.ast.XElement) {
                    const {name} = node;
                    const isSelfClosing = node.startTag.selfClosing;
                    const hasEndTag = node.endTag != null;

                    if (!hasEndTag && !isSelfClosing) {
                        context.report({
                            node: node.startTag,
                            loc: node.startTag.loc,
                            message: '\'<{{name}}>\' 没有结束标签',
                            data: {name},
                        });
                    }
                },
            });
    },
};