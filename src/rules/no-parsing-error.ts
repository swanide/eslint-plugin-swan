/**
 * @file no-parsing-error.ts
 * @author mengke01(kekee000@gmail.com)
 */
import type swan from '@baidu/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl} from '../utils';

const parserErrorCode = {
    'abrupt-closing-of-empty-comment': true,
    'control-character-in-input-stream': true,
    'eof-before-tag-name': true,
    'eof-in-comment': true,
    'eof-in-tag': true,
    'incorrectly-closed-comment': true,
    'incorrectly-opened-comment': true,
    'invalid-first-character-of-tag-name': true,
    'missing-attribute-value': true,
    'missing-end-tag-name': true,
    'missing-whitespace-between-attributes': true,
    'nested-comment': true,
    'noncharacter-in-input-stream': true,
    'surrogate-in-input-stream': true,
    'unexpected-character-in-attribute-name': true,
    'unexpected-character-in-unquoted-attribute-value': true,
    'unexpected-equals-sign-before-attribute-name': true,
    'unexpected-null-character': true,
    'unexpected-question-mark-instead-of-tag-name': true,
    'unexpected-solidus-in-tag': true,
    'end-tag-with-attributes': true,
    'duplicate-attribute': true,
    'non-void-html-element-start-tag-with-trailing-solidus': true,
    'attribute-value-invalid-unquoted': true,
    'unexpected-line-break': true,
    'missing-expression-end-tag': true,
    'missing-end-tag': true,
    'x-invalid-end-tag': true,
    'x-invalid-directive': true,
    'x-expression-error': true,
};

const DEFAULT_OPTIONS = Object.freeze({...parserErrorCode});

const messageZH: Record<keyof typeof parserErrorCode, string> = {
    'abrupt-closing-of-empty-comment': '注释闭合错误',
    'control-character-in-input-stream': '页面不允许控制字符',
    'eof-before-tag-name': '标签未正常结束',
    'eof-in-comment': '注释未正常结束',
    'eof-in-tag': '标签未正常结束',
    'incorrectly-closed-comment': '注释闭合错误',
    'incorrectly-opened-comment': '注释闭合错误',
    'invalid-first-character-of-tag-name': '标签首字符不合法',
    'missing-attribute-value': '未正确设置属性值',
    'missing-end-tag-name': '缺少结束标签',
    'missing-whitespace-between-attributes': '属性之间没有空格',
    'nested-comment': '不允许注释嵌套',
    'noncharacter-in-input-stream': '页面中不允许空字符',
    'surrogate-in-input-stream': '页面中不允许使用私有字符 0xD800 ~ 0xDFFF',
    'unexpected-character-in-attribute-name': '属性名称不合法',
    'unexpected-character-in-unquoted-attribute-value': '属性值包含非法字符',
    'unexpected-equals-sign-before-attribute-name': '非法的 \'=\' 字符',
    'unexpected-null-character': '非法的空字符',
    'unexpected-question-mark-instead-of-tag-name': '属性名中包含非法的 \'?\' 字符',
    'unexpected-solidus-in-tag': '非法的 \'/\' 字符',
    'end-tag-with-attributes': '结束标签不应该包含属性',
    'duplicate-attribute': '重复的属性定义',
    'non-void-html-element-start-tag-with-trailing-solidus': '非自闭合标签',
    'attribute-value-invalid-unquoted': '属性值需要使用 \'\'\' 或 \'"\'包裹',
    'unexpected-line-break': '非预期的换行',
    'missing-expression-end-tag': '缺少 mustache 结束标签',
    'missing-end-tag': '缺少结束标签',
    'x-invalid-end-tag': '标签错误',
    'x-invalid-directive': '错误的指令名称',
    'x-expression-error': '错误的表达式',
};

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow parsing errors',
            categories: ['base'],
            url: getRuleUrl('no-parsing-error'),
        },
        fixable: null,
        schema: [
            {
                type: 'object',
                properties: Object.keys(DEFAULT_OPTIONS).reduce((ret, code) => {
                    ret[code] = {type: 'boolean'};
                    return ret;
                }, ({})),
                additionalProperties: false,
            },
        ],
    },

    create(context: RuleContext) {
        const options = {...DEFAULT_OPTIONS, ...context.options[0] || {}};

        return {

            Program(program: swan.ast.ScriptProgram) {
                const node = program.templateBody;
                if (node == null || node.errors == null) {
                    return;
                }

                for (const error of node.errors) {
                    if (error.code && !options[error.code]) {
                        continue;
                    }
                    const rawMessage = error.message.endsWith('.')
                        ? error.message.slice(0, -1)
                        : error.message;
                    const message = messageZH[rawMessage] || rawMessage;

                    context.report({
                        node,
                        loc: {line: error.lineNumber, column: error.column},
                        message: 'Parsing error: {{message}}.',
                        data: {
                            message,
                        },
                    });
                }
            },
        };
    },
};
