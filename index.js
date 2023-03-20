/**
 * @author kekee000@gmail.com
 * See LICENSE file in root directory for full license.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function addDisableRule(disableRuleKeys, rule, key) {
    let keys = disableRuleKeys.get(rule);
    if (keys) {
        keys.push(key);
    }
    else {
        keys = [key];
        disableRuleKeys.set(rule, keys);
    }
}
function messageToKey(message) {
    return `line:${message.line},column${message.column - 1}`;
}
function compareLocations(itemA, itemB) {
    return itemA.line - itemB.line || itemA.column - itemB.column;
}
var swanParser = {
    preprocess(code) {
        return [code];
    },
    postprocess(messages) {
        const state = {
            block: {
                disableAllKeys: new Set(),
                disableRuleKeys: new Map(),
            },
            line: {
                disableAllKeys: new Set(),
                disableRuleKeys: new Map(),
            },
        };
        const usedDisableDirectiveKeys = [];
        const unusedDisableDirectiveReports = new Map();
        const filteredMessages = messages[0].filter(message => {
            var _a;
            if ((_a = message === null || message === void 0 ? void 0 : message.ruleId) === null || _a === void 0 ? void 0 : _a.endsWith('swan/comment-directive')) {
                const directiveType = message.messageId;
                const data = message.message.split(' ');
                switch (directiveType) {
                    case 'disableBlock':
                        state.block.disableAllKeys.add(data[1]);
                        break;
                    case 'disableLine':
                        state.line.disableAllKeys.add(data[1]);
                        break;
                    case 'enableBlock':
                        state.block.disableAllKeys.clear();
                        break;
                    case 'enableLine':
                        state.line.disableAllKeys.clear();
                        break;
                    case 'disableBlockRule':
                        addDisableRule(state.block.disableRuleKeys, data[1], data[2]);
                        break;
                    case 'disableLineRule':
                        addDisableRule(state.line.disableRuleKeys, data[1], data[2]);
                        break;
                    case 'enableBlockRule':
                        state.block.disableRuleKeys.delete(data[1]);
                        break;
                    case 'enableLineRule':
                        state.line.disableRuleKeys.delete(data[1]);
                        break;
                    case 'clear':
                        state.block.disableAllKeys.clear();
                        state.block.disableRuleKeys.clear();
                        state.line.disableAllKeys.clear();
                        state.line.disableRuleKeys.clear();
                        break;
                    default:
                        unusedDisableDirectiveReports.set(messageToKey(message), message);
                        break;
                }
                return false;
            }
            const disableDirectiveKeys = [];
            if (state.block.disableAllKeys.size) {
                disableDirectiveKeys.push(...state.block.disableAllKeys);
            }
            if (state.line.disableAllKeys.size) {
                disableDirectiveKeys.push(...state.line.disableAllKeys);
            }
            if (message.ruleId) {
                const block = state.block.disableRuleKeys.get(message.ruleId);
                if (block) {
                    disableDirectiveKeys.push(...block);
                }
                const line = state.line.disableRuleKeys.get(message.ruleId);
                if (line) {
                    disableDirectiveKeys.push(...line);
                }
            }
            if (disableDirectiveKeys.length) {
                usedDisableDirectiveKeys.push(...disableDirectiveKeys);
                return false;
            }
            return true;
        });
        if (unusedDisableDirectiveReports.size) {
            for (const key of usedDisableDirectiveKeys) {
                unusedDisableDirectiveReports.delete(key);
            }
            filteredMessages.push(...unusedDisableDirectiveReports.values());
            filteredMessages.sort(compareLocations);
        }
        return filteredMessages;
    },
    supportsAutofix: true,
};

const globals = {
    App: true,
    Page: true,
    Component: true,
    swan: true,
    getApp: true,
    getCurrentPages: true,
};
var base = {
    overrides: [
        {
            files: ['*.swan'],
            plugins: ['@baidu/eslint-plugin-swan'],
            parser: require.resolve('@baidu/swan-eslint-parser'),
            env: {
                'browser': true,
                'es6': true,
                '@baidu/swan/globals': true,
            },
            rules: {
                'indent': 0,
                'no-multi-spaces': 0,
                'import/unambiguous': 0,
                'babel/new-cap': 0,
                '@babel/new-cap': 0,
                'import/no-commonjs': 0,
                'max-len': 0,
                'spaced-comment': 0,
                'no-empty-character-class': 0,
                'no-redeclare': 0,
                'no-unused-vars': 0,
                'no-var': 0,
                'object-shorthand': 0,
                'prefer-template': 0,
                'prefer-destructuring': 0,
                'prefer-spread': 0,
                'prefer-arrow-callback': 0,
                'prefer-const': 0,
                'no-magic-numbers': 0,
                'eol-last': 0,
                '@baidu/swan/comment-directive': 2,
                '@baidu/swan/no-parsing-error': 2,
                '@baidu/swan/no-duplicate-attributes': 2,
                '@baidu/swan/no-useless-mustache': 2,
                '@baidu/swan/no-unary-operator': 2,
                '@baidu/swan/valid-for': [2, { ignoreDuplicateForItem: true }],
                '@baidu/swan/valid-if': 2,
                '@baidu/swan/valid-elif': 2,
                '@baidu/swan/valid-else': 2,
                '@baidu/swan/no-confusing-for-if': 2,
                '@baidu/swan/html-end-tag': 2,
                '@baidu/swan/valid-bind': 2,
                '@baidu/swan/template-name': 2,
                '@baidu/swan/filter-name': 2,
            },
        },
    ],
    globals,
};

var __rest$1 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const _a$1 = base.overrides[0], { rules: baseRules } = _a$1, baseOverwritesSwan = __rest$1(_a$1, ["rules"]);
var recommended = Object.assign(Object.assign({}, base), { overrides: [
        Object.assign(Object.assign({}, baseOverwritesSwan), { rules: Object.assign(Object.assign({}, baseRules), { 'max-len': [1, 200], '@baidu/swan/xml-indent': [
                    1,
                    4,
                    { baseIndent: 1, scriptBaseIndent: 0, alignAttributesVertically: false },
                ], '@baidu/swan/no-multi-spaces': 1, '@baidu/swan/valid-component-nesting': [1, { allowEmptyBlock: true, ignoreEmptyBlock: ['view'] }], '@baidu/swan/arrow-spacing': 2, '@baidu/swan/dot-location': [2, 'property'], '@baidu/swan/array-bracket-spacing': 1, '@baidu/swan/dot-notation': 1, '@baidu/swan/key-spacing': 1, '@baidu/swan/keyword-spacing': 1, '@baidu/swan/no-useless-concat': 2 }) }),
    ] });

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const _a = recommended.overrides[0], { rules: recommendedRules } = _a, recommendedOverwritesSwan = __rest(_a, ["rules"]);
var strict = Object.assign(Object.assign({}, recommended), { overrides: [
        Object.assign(Object.assign({}, recommendedOverwritesSwan), { rules: Object.assign(Object.assign({}, recommendedRules), { 'max-len': [2, 200], '@baidu/swan/xml-indent': [
                    2,
                    4,
                    { baseIndent: 1, scriptBaseIndent: 0, alignAttributesVertically: false },
                ], '@baidu/swan/valid-for': [2, { ignoreDuplicateForItem: false }], '@baidu/swan/valid-component-nesting': [1, { allowEmptyBlock: false, ignoreEmptyBlock: ['view'] }], '@baidu/swan/no-multi-spaces': 1, '@baidu/swan/mustache-interpolation-spacing': [1, 'never'], '@baidu/swan/eqeqeq': 2, '@baidu/swan/func-call-spacing': 1 }) }),
    ] });

const emptyTextReg = /^\s*$/;
const isSwanFile = (filename) => filename.endsWith('.swan');
const getRuleUrl = (name) => `${process.env.SWAN_LINT_RULE_URL || 'https://smartprogram.baidu.com/docs/develop/lint'}/rules/${name}.md`;
let ruleMap = null;
function getCoreRule(name) {
    let eslintModule = null;
    if (process.env.ESLINT_MODULE_PATH) {
        eslintModule = require(process.env.ESLINT_MODULE_PATH);
    }
    else {
        eslintModule = require('eslint');
    }
    const map = ruleMap || (ruleMap = new (eslintModule.Linter)().getRules());
    return map.get(name);
}
function wrapContextToOverrideTokenMethods(context, tokenStore) {
    const eslintSourceCode = context.getSourceCode();
    let tokensAndComments = null;
    function getTokensAndComments() {
        if (tokensAndComments) {
            return tokensAndComments;
        }
        const { templateBody } = eslintSourceCode.ast;
        tokensAndComments = templateBody
            ? tokenStore.getTokens(templateBody, {
                includeComments: true,
            })
            : [];
        return tokensAndComments;
    }
    const sourceCode = new Proxy((Object.assign({}, eslintSourceCode)), {
        get(_object, key) {
            if (key === 'tokensAndComments') {
                return getTokensAndComments();
            }
            return key in tokenStore ? tokenStore[key] : eslintSourceCode[key];
        },
    });
    return {
        __proto__: context,
        getSourceCode() {
            return sourceCode;
        },
    };
}
function defineTemplateBodyVisitor(context, templateBodyVisitor, scriptVisitor) {
    if (context.parserServices.defineTemplateBodyVisitor == null) {
        if (isSwanFile(context.getFilename())) {
            context.report({
                loc: { line: 1, column: 0 },
                message: 'Use the latest @baidu/swan-eslint-parser.',
            });
        }
        return {};
    }
    return context.parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
}
function getPrevNode(node) {
    const { children } = node.parent;
    if (!children || !children.length) {
        return null;
    }
    let index = children.indexOf(node);
    if (index <= 0) {
        return null;
    }
    let prevNode = null;
    while ((prevNode = children[--index])) {
        if (prevNode.type !== 'XText'
            || prevNode.type === 'XText' && !emptyTextReg.test(prevNode.value)) {
            break;
        }
    }
    return prevNode;
}
function getAttribute(node, name) {
    return (node.startTag.attributes.find(node => (node.type === 'XDirective' && node.key.name === name)) || null);
}
function hasAttribute(node, name) {
    return Boolean(getAttribute(node, name));
}
function getDirective(node, name) {
    return (node.startTag.attributes.find(node => (node.type === 'XDirective' && node.key.name === name)) || null);
}
function hasDirective(node, name) {
    return Boolean(getDirective(node, name));
}
function isValidSingleMustacheOrExpression(values) {
    var _a;
    if ((values === null || values === void 0 ? void 0 : values.length) !== 1) {
        return false;
    }
    const [value] = values;
    if (value.type === 'XExpression' && value.expression != null) {
        return true;
    }
    if (value.type === 'XMustache' && ((_a = value.value) === null || _a === void 0 ? void 0 : _a.expression) != null) {
        return true;
    }
    return false;
}
function isValidSingleMustache(values) {
    var _a;
    if ((values === null || values === void 0 ? void 0 : values.length) !== 1) {
        return false;
    }
    const [value] = values;
    if (value.type === 'XMustache' && ((_a = value.value) === null || _a === void 0 ? void 0 : _a.expression) != null) {
        return true;
    }
    return false;
}
function isIdentifierExpression(values) {
    var _a;
    if ((values === null || values === void 0 ? void 0 : values.length) !== 1) {
        return false;
    }
    const [value] = values;
    return value.type === 'XExpression' && ((_a = value.expression) === null || _a === void 0 ? void 0 : _a.type) === 'Identifier';
}
function getValueType(node) {
    if (node.value == null || !node.value.length) {
        return 'none';
    }
    if (node.value.every(v => v.type === 'XLiteral')) {
        return 'literal';
    }
    if (node.value.every(v => v.type === 'XMustache')) {
        return 'mustache';
    }
    if (node.value.every(v => v.type === 'XExpression')) {
        return 'expression';
    }
    return 'mixed';
}
function wrapCoreRule(coreRuleName) {
    const coreRule = getCoreRule(coreRuleName);
    return {
        create(context) {
            const tokenStore = context.parserServices.getTemplateBodyTokenStore
                && context.parserServices.getTemplateBodyTokenStore();
            if (tokenStore) {
                context = wrapContextToOverrideTokenMethods(context, tokenStore);
            }
            const coreHandlers = coreRule.create(context);
            const handlers = Object.assign({}, coreHandlers);
            for (const [key, handler] of Object.entries(handlers)) {
                let newKey = null;
                if (key === 'Program' || key === 'Program:exit') {
                    newKey = key.replace(/\bProgram\b/g, 'XExpression');
                }
                else {
                    newKey = key.replace(/^|(?<=,)/g, 'XExpression ');
                }
                handlers[newKey] = handler;
                delete handlers[key];
            }
            return context.parserServices.defineTemplateBodyVisitor(handlers);
        },
        meta: Object.assign(Object.assign({}, coreRule.meta), { docs: Object.assign(Object.assign({}, coreRule.meta.docs), { category: '', categories: ['essential'], url: getRuleUrl(coreRuleName), extensionRule: true, coreRuleUrl: coreRule.meta.docs.url }) }),
    };
}

var arrayBracketSpacing = wrapCoreRule('array-bracket-spacing');

var arrowSpacing = wrapCoreRule('arrow-spacing');

const COMMENT_DIRECTIVE_B = /^\s*(eslint-(?:en|dis)able)(?:\s+|$)/;
const COMMENT_DIRECTIVE_L = /^\s*(eslint-disable(?:-next)?-line)(?:\s+|$)/;
function stripDirectiveComment(value) {
    return value.split(/\s-{2,}\s/u)[0];
}
function parse(pattern, comment) {
    const text = stripDirectiveComment(comment);
    const match = pattern.exec(text);
    if (match == null) {
        return null;
    }
    const type = match[1];
    const rules = [];
    const rulesRe = /([^,\s]+)[,\s]*/g;
    let startIndex = match[0].length;
    rulesRe.lastIndex = startIndex;
    let res = null;
    while ((res = rulesRe.exec(text))) {
        const ruleId = res[1].trim();
        rules.push({
            ruleId,
            index: startIndex,
        });
        startIndex = rulesRe.lastIndex;
    }
    return { type, rules };
}
function enable(context, loc, group, rule) {
    if (!rule) {
        context.report({
            loc,
            messageId: group === 'block' ? 'enableBlock' : 'enableLine',
        });
    }
    else {
        context.report({
            loc,
            messageId: group === 'block' ? 'enableBlockRule' : 'enableLineRule',
            data: { rule },
        });
    }
}
function disable(context, loc, group, rule, key) {
    if (!rule) {
        context.report({
            loc,
            messageId: group === 'block' ? 'disableBlock' : 'disableLine',
            data: { key },
        });
    }
    else {
        context.report({
            loc,
            messageId: group === 'block' ? 'disableBlockRule' : 'disableLineRule',
            data: { rule, key },
        });
    }
}
function locToKey(location) {
    return `line:${location.line},column${location.column}`;
}
function reportUnused(context, comment, kind) {
    const { loc } = comment;
    context.report({
        loc,
        messageId: 'unused',
        data: { kind },
    });
    return locToKey(loc.start);
}
function reportUnusedRules(context, comment, kind, rules) {
    const sourceCode = context.getSourceCode();
    const commentStart = comment.range[0] + 4;
    return rules.map(rule => {
        const start = sourceCode.getLocFromIndex(commentStart + rule.index);
        const end = sourceCode.getLocFromIndex(commentStart + rule.index + rule.ruleId.length);
        context.report({
            loc: { start, end },
            messageId: 'unusedRule',
            data: { rule: rule.ruleId, kind },
        });
        return {
            ruleId: rule.ruleId,
            key: locToKey(start),
        };
    });
}
function processBlock(context, comment, reportUnusedDisableDirectives) {
    const parsed = parse(COMMENT_DIRECTIVE_B, comment.value);
    if (parsed != null) {
        if (parsed.type === 'eslint-disable') {
            if (parsed.rules.length) {
                const rules = reportUnusedDisableDirectives
                    ? reportUnusedRules(context, comment, parsed.type, parsed.rules)
                    : parsed.rules;
                for (const rule of rules) {
                    disable(context, comment.loc.start, 'block', rule.ruleId, rule.key || '*');
                }
            }
            else {
                const key = reportUnusedDisableDirectives
                    ? reportUnused(context, comment, parsed.type)
                    : '';
                disable(context, comment.loc.start, 'block', null, key);
            }
        }
        else if (parsed.rules.length) {
            for (const rule of parsed.rules) {
                enable(context, comment.loc.start, 'block', rule.ruleId);
            }
        }
        else {
            enable(context, comment.loc.start, 'block', null);
        }
    }
}
function processLine(context, comment, reportUnusedDisableDirectives) {
    const parsed = parse(COMMENT_DIRECTIVE_L, comment.value);
    if (parsed != null && comment.loc.start.line === comment.loc.end.line) {
        const line = +comment.loc.start.line + (parsed.type === 'eslint-disable-line' ? 0 : 1);
        const column = -1;
        if (parsed.rules.length) {
            const rules = reportUnusedDisableDirectives
                ? reportUnusedRules(context, comment, parsed.type, parsed.rules)
                : parsed.rules;
            for (const rule of rules) {
                disable(context, { line, column }, 'line', rule.ruleId, rule.key || '');
                enable(context, { line: line + 1, column }, 'line', rule.ruleId);
            }
        }
        else {
            const key = reportUnusedDisableDirectives
                ? reportUnused(context, comment, parsed.type)
                : '';
            disable(context, { line, column }, 'line', null, key);
            enable(context, { line: line + 1, column }, 'line', null);
        }
    }
}
function extractTopLevelHTMLElements(documentFragment) {
    return documentFragment.children.filter(node => node.type === 'XElement');
}
function extractTopLevelDocumentFragmentComments(documentFragment) {
    const elements = extractTopLevelHTMLElements(documentFragment);
    return documentFragment.comments.filter(comment => elements.every(element => comment.range[1] <= element.range[0]
        || element.range[1] <= comment.range[0]));
}
var commentDirective = {
    meta: {
        type: 'problem',
        docs: {
            description: 'support comment-directives',
            categories: ['base'],
            url: getRuleUrl('comment-directive'),
        },
        schema: [
            {
                type: 'object',
                properties: {
                    reportUnusedDisableDirectives: {
                        type: 'boolean',
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            disableBlock: '--block {{key}}',
            enableBlock: '++block',
            disableLine: '--line {{key}}',
            enableLine: '++line',
            disableBlockRule: '-block {{rule}} {{key}}',
            enableBlockRule: '+block {{rule}}',
            disableLineRule: '-line {{rule}} {{key}}',
            enableLineRule: '+line {{rule}}',
            clear: 'clear',
            unused: 'Unused {{kind}} directive (no problems were reported).',
            unusedRule: 'Unused {{kind}} directive (no problems were reported from \'{{rule}}\').',
        },
    },
    create(context) {
        const options = context.options[0] || {};
        const { reportUnusedDisableDirectives } = options;
        const documentFragment = context.parserServices.getDocumentFragment
            && context.parserServices.getDocumentFragment();
        return {
            Program(node) {
                if (node.templateBody) {
                    for (const comment of node.templateBody.comments) {
                        processBlock(context, comment, reportUnusedDisableDirectives);
                        processLine(context, comment, reportUnusedDisableDirectives);
                    }
                    context.report({
                        loc: node.templateBody.loc.end,
                        messageId: 'clear',
                    });
                }
                if (documentFragment) {
                    for (const comment of extractTopLevelDocumentFragmentComments(documentFragment)) {
                        processBlock(context, comment, reportUnusedDisableDirectives);
                        processLine(context, comment, reportUnusedDisableDirectives);
                    }
                    for (const element of extractTopLevelHTMLElements(documentFragment)) {
                        context.report({
                            loc: element.loc.end,
                            messageId: 'clear',
                        });
                    }
                }
            },
        };
    },
};

var dotLocation = wrapCoreRule('dot-location');

var dotNotation = wrapCoreRule('dot-notation');

var eqeqeq = wrapCoreRule('eqeqeq');

const filterNameReg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
var filterName = {
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
    create(context) {
        return defineTemplateBodyVisitor(context, {
            'XElement'(node) {
                if (node.name !== 'filter' && node.name !== 'import-sjs') {
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
                if (attr.key.name === 'module'
                    && (getValueType(attr) !== 'literal'
                        || !filterNameReg.test(attr.value[0].value))) {
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

var funcCallSpacing = wrapCoreRule('func-call-spacing');

var htmlEndTag = {
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
    create(context) {
        return defineTemplateBodyVisitor(context, {
            'XElement'(node) {
                const { name } = node;
                const isSelfClosing = node.startTag.selfClosing;
                const hasEndTag = node.endTag != null;
                if (!hasEndTag && !isSelfClosing) {
                    context.report({
                        node: node.startTag,
                        loc: node.startTag.loc,
                        message: '\'<{{name}}>\' 没有结束标签',
                        data: { name },
                    });
                }
            },
        });
    },
};

var keySpacing = wrapCoreRule('key-spacing');

var keywordSpacing = wrapCoreRule('keyword-spacing');

var mustacheInterpolationSpacing = {
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
    create(context) {
        const options = context.options[0] || 'always';
        const tokenStore = context.parserServices.getTemplateBodyTokenStore
            && context.parserServices.getTemplateBodyTokenStore();
        return defineTemplateBodyVisitor(context, {
            'XMustache[value!=null]'(node) {
                const openBrace = tokenStore.getFirstToken(node);
                const closeBrace = tokenStore.getLastToken(node);
                if (!openBrace
                    || !closeBrace
                    || openBrace.type !== 'XMustacheStart'
                    || closeBrace.type !== 'XMustacheEnd'
                    || openBrace.value === '{') {
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
                            message: '\'{{\' 后面需要一个空格',
                            fix: fixer => fixer.insertTextAfter(openBrace, ' '),
                        });
                    }
                    if (closeBrace.range[0] === lastToken.range[1]) {
                        context.report({
                            node: closeBrace,
                            message: '\'}}\' 前面需要一个空格',
                            fix: fixer => fixer.insertTextBefore(closeBrace, ' '),
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
                            message: '\'{{\' 后面不允许空格',
                            fix: fixer => fixer.removeRange([openBrace.range[1], firstToken.range[0]]),
                        });
                    }
                    if (closeBrace.range[0] !== lastToken.range[1]) {
                        context.report({
                            loc: {
                                start: lastToken.loc.end,
                                end: closeBrace.loc.end,
                            },
                            message: '\'}}\' 前面不允许空格',
                            fix: fixer => fixer.removeRange([lastToken.range[1], closeBrace.range[0]]),
                        });
                    }
                }
            },
        });
    },
};

function getRefs(node) {
    return node
        ? node.value
            .filter(i => { var _a; return i.type === 'XMustache' && ((_a = i.value) === null || _a === void 0 ? void 0 : _a.references) || i.type === 'XExpression' && i.references; })
            .reduce((references, node) => references.concat(node.type === 'XMustache'
            ? node.value.references
            : node.references), [])
        : [];
}
function getLiteralRefs(node) {
    return node
        ? node.value
            .filter(i => i.type === 'XLiteral')
            .reduce((references, node) => references.concat(node.value), [])
        : [];
}
var noConfusingForIf = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow confusing `for` and `if` directive on the same element',
            categories: ['essential'],
            url: getRuleUrl('no-confusing-for-if'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return defineTemplateBodyVisitor(context, {
            'XDirective[key.name=\'if\']'(node) {
                const element = node.parent.parent;
                const prefix = node.key.prefix;
                if (hasDirective(element, 'for')) {
                    const forItemNode = getDirective(element, 'for-item');
                    const ifRefs = getRefs(node);
                    const forRefs = forItemNode
                        ? getLiteralRefs(forItemNode)
                        : ['item'];
                    const isRefMatches = ifRefs.some(ref => forRefs.some(variable => variable === ref.id.name));
                    if (isRefMatches) {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `'${prefix}if' 不允许和 '${prefix}for' 在一个标签中定义`,
                        });
                    }
                }
            },
        });
    },
};

var noDuplicateAttributes = {
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
    create(context) {
        const directiveNames = new Set();
        return defineTemplateBodyVisitor(context, {
            XStartTag() {
                directiveNames.clear();
            },
            XDirective(node) {
                if (node.key.name == null) {
                    return;
                }
                const name = `${node.key.prefix}${node.key.name}`;
                if (directiveNames.has(name)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: '\'{{name}}\' 属性名重复',
                        data: { name },
                    });
                }
                directiveNames.add(name);
            },
        });
    },
};

const isProperty = (context, node) => {
    const sourceCode = context.getSourceCode();
    return node.type === 'Punctuator' && sourceCode.getText(node) === ':';
};
var noMultiSpaces = {
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
                    message: `${sourceCode.getText(token)} 前有多个空格，只允许 1 个空格`,
                    fix: fixer => fixer.replaceTextRange([prevToken.range[1], token.range[0]], ' '),
                });
            }
            prevToken = token;
        }
        return {};
    },
};

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
const DEFAULT_OPTIONS = Object.freeze(Object.assign({}, parserErrorCode));
const messageZH = {
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
var noParsingError = {
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
                    ret[code] = { type: 'boolean' };
                    return ret;
                }, ({})),
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = Object.assign(Object.assign({}, DEFAULT_OPTIONS), context.options[0] || {});
        return {
            Program(program) {
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
                        loc: { line: error.lineNumber, column: error.column },
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

var noUnaryOperator = {
    meta: {
        docs: {
            description: 'disallow unary-operator in mustache interpolations',
            categories: ['essential'],
            url: getRuleUrl('no-unary-operator'),
        },
        fixable: 'code',
        schema: [],
        type: 'problem',
    },
    create(context) {
        function verify(node) {
            if (node.operator === '+') {
                context.report({
                    node,
                    message: '在版本低于 3.230.0 的基础库上不支持一元表达式 \'+\'',
                    loc: node.loc,
                    fix: null,
                });
                return;
            }
        }
        return defineTemplateBodyVisitor(context, {
            'XMustache>XExpression UnaryExpression': verify,
            'XDirective>XExpression UnaryExpression': verify,
        });
    },
};

var noUselessConcat = wrapCoreRule('no-useless-concat');

var noUselessMustache = {
    meta: {
        docs: {
            description: 'disallow unnecessary mustache interpolations',
            categories: ['essential'],
            url: getRuleUrl('no-useless-mustache'),
        },
        fixable: 'code',
        schema: [],
        type: 'problem',
    },
    create(context) {
        function verify(node) {
            const { expression } = node.value;
            if (!expression) {
                context.report({
                    node,
                    message: '不允许空的 mustache 表达式',
                    loc: node.loc,
                    fix: fixer => fixer.removeRange(node.range),
                });
                return;
            }
        }
        return defineTemplateBodyVisitor(context, {
            'XMustache': verify,
        });
    },
};

const templateNameReg = /^[a-zA-Z0-9_-]+$/;
var templateName = {
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
    create(context) {
        return defineTemplateBodyVisitor(context, {
            'XElement'(node) {
                if (node.name !== 'template') {
                    return;
                }
                const attr = node.startTag.attributes.find(a => a.key.name === 'name' || a.key.name === 'is');
                if (!attr) {
                    return;
                }
                if (attr.key.name === 'name'
                    && (getValueType(attr) !== 'literal'
                        || !templateNameReg.test(attr.value[0].value))) {
                    context.report({
                        node: attr,
                        loc: attr.loc,
                        message: 'template name 名称必须为字符串，并且符合 \'a-zA-Z0-9_-\'',
                    });
                }
                else if (attr.key.name === 'is'
                    && getValueType(attr) === 'literal'
                    && !templateNameReg.test(attr.value[0].value)) {
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

const eventDiretives = ['bind', 'catch', 'capture-bind', 'capture-catch'];
var validBind = {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate bind directive',
            categories: ['essential'],
            url: getRuleUrl('valid-bind'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return defineTemplateBodyVisitor(context, {
            'XDirective'(node) {
                var _a;
                if (!eventDiretives.includes(node.key.prefix)) {
                    return;
                }
                if (!node.key.name) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${node.key.rawName}' 需要绑定事件名称`,
                    });
                }
                const isMustacheValue = ((_a = node.value[0]) === null || _a === void 0 ? void 0 : _a.type) === 'XMustache';
                if (!(isMustacheValue
                    ? isValidSingleMustache(node.value)
                    : isIdentifierExpression(node.value))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${node.key.rawName}' 值设置不正确`,
                    });
                }
            },
        });
    },
};

const blockComponents = [
    'cover-image',
    'cover-view',
    'match-media',
    'movable-area',
    'movable-view',
    'scroll-view',
    'swiper',
    'swiper-item',
    'view',
];
const inlineComponents = [
    'navigation',
    'icon',
    'progress',
    'rich-text',
    'text',
];
const inlineBlockComponents = [
    'form',
    'button',
    'checkbox',
    'checkbox-group',
    'checkbox',
    'editor',
    'input',
    'label',
    'picker',
    'picker-view',
    'picker-view-column',
    'radio',
    'radio-group',
    'slider',
    'switch',
    'textarea',
    'map',
];
const selfCloseComponents = [
    'audio',
    'camera',
    'image',
    'live-player',
    'live-pusher',
    'voip-room',
    'import',
    'include',
    'input',
    'textarea',
    'switch',
];
const topLevelComponents = [
    'import-sjs',
    'import',
];
const withSrcComponents = [
    'import',
    'include',
    'import-sjs',
    'filter',
];

function isSelfClose(node) {
    if (!node.children.length) {
        return true;
    }
    return node.children.every(i => i.type === 'XText' && /^\s*$/.test(i.value));
}
function getInlineParent(node) {
    while (node && node.type !== 'XDocument') {
        if (inlineComponents.includes(node.name)) {
            return node;
        }
        node = node.parent;
    }
    return null;
}
function isAtTopLevel(node) {
    if (!node.parent || node.parent.type === 'XDocument') {
        return true;
    }
    return false;
}
var validComponentNesting = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'validate component nesting',
            categories: ['essential'],
            url: getRuleUrl('valid-component-nesting'),
        },
        fixable: null,
        schema: [
            {
                type: 'object',
                properties: {
                    allowEmptyBlock: {
                        type: 'boolean',
                    },
                    ignoreEmptyBlock: {
                        type: 'array',
                        items: {
                            allOf: [{ type: 'string' }],
                        },
                        uniqueItems: true,
                    },
                },
            },
        ],
    },
    create(context) {
        const { allowEmptyBlock = false, ignoreEmptyBlock = ['view'] } = context.options[0] || {};
        return defineTemplateBodyVisitor(context, {
            'XElement'(node) {
                if (selfCloseComponents.includes(node.name) && !isSelfClose(node)) {
                    context.report({
                        node: node,
                        loc: node.loc,
                        message: '自闭合的组件不能嵌套子组件',
                    });
                }
                if (withSrcComponents.includes(node.name)
                    && hasAttribute(node, 'src')
                    && !isSelfClose(node)) {
                    context.report({
                        node: node,
                        loc: node.loc,
                        message: `'${node.name}' 带有 'src' 属性，不能嵌套子组件`,
                    });
                }
                if (topLevelComponents.includes(node.name) && !isAtTopLevel(node)) {
                    if (node.name === 'template' && hasAttribute(node, 'is')) ;
                    else {
                        context.report({
                            node: node,
                            loc: node.loc,
                            message: `'${node.name} 需要在最外层定义`,
                        });
                    }
                }
                if ((blockComponents.includes(node.name) || inlineBlockComponents.includes(node.name))) {
                    const parent = getInlineParent(node);
                    if (parent) {
                        context.report({
                            node: node,
                            loc: node.loc,
                            message: '组件 \'{{name}}\' 不能嵌套在 \'{{parentName}}\' 中',
                            data: {
                                name: node.name,
                                parentName: parent.name,
                            },
                        });
                    }
                    if (!allowEmptyBlock
                        && !ignoreEmptyBlock.includes(node.name)
                        && !selfCloseComponents.includes(node.name)
                        && isSelfClose(node)) {
                        context.report({
                            node: node,
                            loc: node.loc,
                            message: '\'{{name}}\' 标签不允许空',
                            data: {
                                name: node.name,
                            },
                        });
                    }
                }
            },
        });
    },
};

var validElif = {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate elif directive',
            categories: ['essential'],
            url: getRuleUrl('valid-elif'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        function verify(node) {
            const element = node.parent.parent;
            const { prefix, name } = node.key;
            const prevElement = getPrevNode(element);
            if (!prevElement || prevElement.type !== 'XElement'
                || (!hasDirective(prevElement, 'if')
                    && !hasDirective(prevElement, 'elif')
                    && !hasDirective(prevElement, 'else-if'))) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${prefix}${name}' 找不到匹配的 '${prefix}if' 或者 '${prefix}elif'`,
                });
            }
            if (!isValidSingleMustacheOrExpression(node.value)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${prefix}${name}' 值不正确`,
                });
            }
        }
        return defineTemplateBodyVisitor(context, {
            'XDirective[key.name="elif"]': verify,
            'XDirective[key.name="else-if"]': verify,
        });
    },
};

var validElse = {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate else directive',
            categories: ['essential'],
            url: getRuleUrl('valid-else'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return defineTemplateBodyVisitor(context, {
            'XDirective[key.name="else"]'(node) {
                var _a;
                const element = node.parent.parent;
                const { prefix } = node.key;
                const prevElement = getPrevNode(element);
                if (!prevElement || prevElement.type !== 'XElement'
                    || (!hasDirective(prevElement, 'if')
                        && !hasDirective(prevElement, 'elif')
                        && !hasDirective(prevElement, 'else-if'))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' 需要有匹配的 '${prefix}if' 或者 '${prefix}elif'`,
                    });
                }
                if ((_a = node.value) === null || _a === void 0 ? void 0 : _a.length) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' 不支持设置值`,
                    });
                }
                if (hasDirective(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' 和 '${prefix}elif' 不可以同时设置在标签上`,
                    });
                }
                if (hasDirective(element, 'else-if')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' 和 '${prefix}else-if' 不可以同时设置在标签上`,
                    });
                }
            },
        });
    },
};

var validFor = {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate for directive',
            categories: ['essential'],
            url: getRuleUrl('valid-for'),
        },
        fixable: null,
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreDuplicateForItem: {
                        type: 'boolean',
                    },
                },
            },
        ],
    },
    create(context) {
        const options = context.options[0] || {};
        const ignoreDuplicateForItem = options.ignoreDuplicateForItem === true;
        const forVisitor = (node) => {
            const { key: { rawName } } = node;
            if (node.value.length > 1 || !isValidSingleMustacheOrExpression(node.value)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' 值为非空表达式`,
                });
            }
        };
        const forItemVisitor = (node) => {
            var _a, _b;
            const { key: { rawName, prefix } } = node;
            const element = node.parent.parent;
            const hasFor = hasDirective(element, 'for');
            if (!hasFor) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' 需要有匹配的 '${prefix}for'`,
                });
            }
            else if (!ignoreDuplicateForItem) {
                const forValues = getDirective(element, 'for').value;
                if (((_a = forValues[0]) === null || _a === void 0 ? void 0 : _a.type) === 'XExpression') {
                    const forValue = forValues[0].expression;
                    if (forValue.left && node.key.name === 'for-item') {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `'${rawName}' 和 '${prefix}for' 重复定义`,
                        });
                    }
                    if (forValue.index && node.key.name === 'for-index') {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `'${rawName}' 和 '${prefix}for' 重复定义`,
                        });
                    }
                }
            }
            if (node.value.length !== 1
                || node.value[0].type !== 'XExpression'
                || ((_b = node.value[0].expression) === null || _b === void 0 ? void 0 : _b.type) !== 'Identifier') {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' 值需要是合法变量`,
                });
            }
        };
        return defineTemplateBodyVisitor(context, {
            'XDirective[key.name="for"]': forVisitor,
            'XDirective[key.name="for-item"]': forItemVisitor,
            'XDirective[key.name="for-index"]': forItemVisitor,
        });
    },
};

var validIf = {
    meta: {
        type: 'problem',
        docs: {
            description: 'validate if directive',
            categories: ['essential'],
            url: getRuleUrl('valid-if'),
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return defineTemplateBodyVisitor(context, {
            'XDirective[key.name="if"]'(node) {
                const element = node.parent.parent;
                const prefix = node.key.prefix;
                if (hasDirective(element, 'else')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' 和 '${prefix}else' 不可以设置在同一个标签上`,
                    });
                }
                if (hasDirective(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' 和 '${prefix}elif' 不可以设置在同一个标签上`,
                    });
                }
                if (hasDirective(element, 'else-if')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' 和 '${prefix}else-if' 不可以设置在同一个标签上`,
                    });
                }
                if (!isValidSingleMustacheOrExpression(node.value)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' 值为非空表达式`,
                    });
                }
            },
        });
    },
};

const KNOWN_NODES = new Set([
    'ArrayExpression',
    'ArrayPattern',
    'ArrowFunctionExpression',
    'AssignmentExpression',
    'AssignmentPattern',
    'AwaitExpression',
    'BinaryExpression',
    'BlockStatement',
    'BreakStatement',
    'CallExpression',
    'CatchClause',
    'ChainExpression',
    'ClassBody',
    'ClassDeclaration',
    'ClassExpression',
    'ConditionalExpression',
    'ContinueStatement',
    'DebuggerStatement',
    'DoWhileStatement',
    'EmptyStatement',
    'ExportAllDeclaration',
    'ExportDefaultDeclaration',
    'ExportNamedDeclaration',
    'ExportSpecifier',
    'ExpressionStatement',
    'ForInStatement',
    'ForOfStatement',
    'ForStatement',
    'FunctionDeclaration',
    'FunctionExpression',
    'Identifier',
    'IfStatement',
    'ImportDeclaration',
    'ImportDefaultSpecifier',
    'ImportExpression',
    'ImportNamespaceSpecifier',
    'ImportSpecifier',
    'LabeledStatement',
    'Literal',
    'LogicalExpression',
    'MemberExpression',
    'MetaProperty',
    'MethodDefinition',
    'NewExpression',
    'ObjectExpression',
    'ObjectPattern',
    'Program',
    'Property',
    'RestElement',
    'ReturnStatement',
    'SequenceExpression',
    'SpreadElement',
    'Super',
    'SwitchCase',
    'SwitchStatement',
    'TaggedTemplateExpression',
    'TemplateElement',
    'TemplateLiteral',
    'ThisExpression',
    'ThrowStatement',
    'TryStatement',
    'UnaryExpression',
    'UpdateExpression',
    'VariableDeclaration',
    'VariableDeclarator',
    'WhileStatement',
    'WithStatement',
    'YieldExpression',
    'XAttribute',
    'XDirective',
    'XDirectiveKey',
    'XDocumentFragment',
    'XElement',
    'XMustache',
    'XModule',
    'SwanForExpression',
    'XIdentifier',
    'XLiteral',
    'XStartTag',
    'XEndTag',
    'XText',
]);
const NON_STANDARD_KNOWN_NODES = new Set([
    'ExperimentalRestProperty',
    'ExperimentalSpreadProperty',
]);
const LT_CHAR = /[\r\n\u2028\u2029]/;
const LINES = /[^\r\n\u2028\u2029]+(?:$|\r\n|[\r\n\u2028\u2029])/g;
const BLOCK_COMMENT_PREFIX = /^\s*\*/;
const ITERATION_OPTS = Object.freeze({
    includeComments: true,
    filter: isNotWhitespace,
});
const PREFORMATTED_ELEMENT_NAMES = ['textarea'];
function parseOptions(type, options, defaultOptions) {
    const ret = Object.assign({ indentChar: ' ', indentSize: 2, baseIndent: 0, scriptBaseIndent: 0, attribute: 1, closeBracket: {
            startTag: 0,
            endTag: 0,
            selfClosingTag: 0,
        }, switchCase: 0, alignAttributesVertically: true, ignores: [] }, defaultOptions);
    if (Number.isSafeInteger(type)) {
        ret.indentSize = Number(type);
    }
    else if (type === 'tab') {
        ret.indentChar = '\t';
        ret.indentSize = 1;
    }
    if (Number.isSafeInteger(options.baseIndent)) {
        ret.baseIndent = options.baseIndent || 0;
    }
    if (Number.isSafeInteger(options.scriptBaseIndent)) {
        ret.scriptBaseIndent = options.scriptBaseIndent || 0;
    }
    if (Number.isSafeInteger(options.attribute)) {
        ret.attribute = options.attribute || 1;
    }
    if (Number.isSafeInteger(options.closeBracket)) {
        const num = Number(options.closeBracket);
        ret.closeBracket = {
            startTag: num,
            endTag: num,
            selfClosingTag: num,
        };
    }
    else if (options.closeBracket) {
        ret.closeBracket = Object.assign({ startTag: 0, endTag: 0, selfClosingTag: 0 }, options.closeBracket);
    }
    if (Number.isSafeInteger(options.switchCase)) {
        ret.switchCase = options.switchCase;
    }
    if (options.alignAttributesVertically != null) {
        ret.alignAttributesVertically = options.alignAttributesVertically;
    }
    if (options.ignores != null) {
        ret.ignores = options.ignores;
    }
    return ret;
}
function isArrow(token) {
    return token != null && token.type === 'Punctuator' && token.value === '=>';
}
function isLeftParen(token) {
    return token != null && token.type === 'Punctuator' && token.value === '(';
}
function isNotLeftParen(token) {
    return token != null && (token.type !== 'Punctuator' || token.value !== '(');
}
function isRightParen(token) {
    return token != null && token.type === 'Punctuator' && token.value === ')';
}
function isNotRightParen(token) {
    return token != null && (token.type !== 'Punctuator' || token.value !== ')');
}
function isLeftBrace(token) {
    return token != null && token.type === 'Punctuator' && token.value === '{';
}
function isRightBrace(token) {
    return token != null && token.type === 'Punctuator' && token.value === '}';
}
function isLeftBracket(token) {
    return token != null && token.type === 'Punctuator' && token.value === '[';
}
function isRightBracket(token) {
    return token != null && token.type === 'Punctuator' && token.value === ']';
}
function isSemicolon(token) {
    return token != null && token.type === 'Punctuator' && token.value === ';';
}
function isComma(token) {
    return token != null && token.type === 'Punctuator' && token.value === ',';
}
function isWildcard(token) {
    return token != null && token.type === 'Punctuator' && token.value === '*';
}
function isNotWhitespace(token) {
    return token != null && token.type !== 'HTMLWhitespace';
}
function isComment(token) {
    return (token != null
        && (token.type === 'Block'
            || token.type === 'Line'
            || token.type === 'Shebang'
            || (typeof token.type
                === 'string'
                && token.type.endsWith('Comment'))));
}
function isNotComment(token) {
    return (token != null
        && token.type !== 'Block'
        && token.type !== 'Line'
        && token.type !== 'Shebang'
        && !(typeof token.type === 'string' && token.type.endsWith('Comment')));
}
function isNotEmptyTextNode(node) {
    return !(node.type === 'XText' && node.value.trim() === '');
}
function last(xs) {
    return xs.length === 0 ? void 0 : xs[xs.length - 1];
}
function isBeginningOfLine(node, index, nodes) {
    if (node != null) {
        for (let i = index - 1; i >= 0; --i) {
            const prevNode = nodes[i];
            if (prevNode == null) {
                continue;
            }
            return node.loc.start.line !== prevNode.loc.end.line;
        }
    }
    return false;
}
function isClosingToken(token) {
    return (token != null && (token.type === 'HTMLEndTagOpen'
        || token.type === 'VExpressionEnd'
        || (token.type === 'Punctuator' && (token.value === ')' || token.value === '}' || token.value === ']'))));
}
const defineVisitor = function create(context, tokenStore, defaultOptions) {
    if (!(/\.swan$/.exec(context.getFilename()))) {
        return {};
    }
    const options = parseOptions(context.options[0], context.options[1] || {}, defaultOptions);
    const sourceCode = context.getSourceCode();
    const offsets = new Map();
    const ignoreTokens = new Set();
    function setOffset(token, offset, baseToken) {
        if (!token) {
            return;
        }
        if (Array.isArray(token)) {
            for (const t of token) {
                offsets.set(t, {
                    baseToken,
                    offset,
                    baseline: false,
                    expectedIndent: void 0,
                });
            }
        }
        else {
            offsets.set(token, {
                baseToken,
                offset,
                baseline: false,
                expectedIndent: void 0,
            });
        }
    }
    function setBaseline(token) {
        const offsetInfo = offsets.get(token);
        if (offsetInfo != null) {
            offsetInfo.baseline = true;
        }
    }
    function setPreformattedTokens(node) {
        const endToken = (node.endTag && tokenStore.getFirstToken(node.endTag)) || tokenStore.getTokenAfter(node);
        const option = {
            includeComments: true,
            filter: (token) => token != null && (token.type === 'HTMLText'
                || token.type === 'HTMLRCDataText'
                || token.type === 'HTMLTagOpen'
                || token.type === 'HTMLEndTagOpen'
                || token.type === 'HTMLComment'),
        };
        for (const token of tokenStore.getTokensBetween(node.startTag, endToken, option)) {
            ignoreTokens.add(token);
        }
        ignoreTokens.add(endToken);
    }
    function getFirstAndLastTokens(node, borderOffset = 0) {
        borderOffset |= 0;
        let firstToken = tokenStore.getFirstToken(node);
        let lastToken = tokenStore.getLastToken(node);
        let t = null;
        let u = null;
        while ((t = tokenStore.getTokenBefore(firstToken)) != null
            && (u = tokenStore.getTokenAfter(lastToken)) != null
            && isLeftParen(t)
            && isRightParen(u)
            && t.range[0] >= borderOffset) {
            firstToken = t;
            lastToken = u;
        }
        return { firstToken, lastToken };
    }
    function processNodeList(nodeList, left, right, offset, alignVertically = true) {
        let t = null;
        const leftToken = left && tokenStore.getFirstToken(left);
        const rightToken = right && tokenStore.getFirstToken(right);
        if (nodeList.length >= 1) {
            let baseToken = null;
            let lastToken = left;
            const alignTokensBeforeBaseToken = [];
            const alignTokens = [];
            for (let i = 0; i < nodeList.length; ++i) {
                const node = nodeList[i];
                if (node == null) {
                    continue;
                }
                const elementTokens = getFirstAndLastTokens(node, lastToken != null ? lastToken.range[1] : 0);
                if (lastToken != null) {
                    t = lastToken;
                    while ((t = tokenStore.getTokenAfter(t, ITERATION_OPTS)) != null
                        && t.range[1] <= elementTokens.firstToken.range[0]) {
                        if (baseToken == null) {
                            alignTokensBeforeBaseToken.push(t);
                        }
                        else {
                            alignTokens.push(t);
                        }
                    }
                }
                if (baseToken == null) {
                    baseToken = elementTokens.firstToken;
                }
                else {
                    alignTokens.push(elementTokens.firstToken);
                }
                lastToken = elementTokens.lastToken;
            }
            if (rightToken != null && lastToken != null) {
                t = lastToken;
                while ((t = tokenStore.getTokenAfter(t, ITERATION_OPTS)) != null && t.range[1] <= rightToken.range[0]) {
                    if (baseToken == null) {
                        alignTokensBeforeBaseToken.push(t);
                    }
                    else {
                        alignTokens.push(t);
                    }
                }
            }
            if (leftToken != null) {
                setOffset(alignTokensBeforeBaseToken, offset, leftToken);
            }
            if (baseToken != null) {
                if (leftToken != null) {
                    setOffset(baseToken, offset, leftToken);
                }
                if (nodeList.some(isBeginningOfLine)) {
                    setBaseline(baseToken);
                }
                if (alignVertically === false && leftToken != null) {
                    setOffset(alignTokens, offset, leftToken);
                }
                else {
                    setOffset(alignTokens, 0, baseToken);
                }
            }
        }
        if (rightToken != null && leftToken != null) {
            setOffset(rightToken, 0, leftToken);
        }
    }
    function processMaybeBlock(node, baseToken) {
        const { firstToken } = getFirstAndLastTokens(node);
        setOffset(firstToken, isLeftBrace(firstToken) ? 0 : 1, baseToken);
    }
    function getPrefixTokens(node) {
        const prefixes = [];
        let token = tokenStore.getFirstToken(node);
        while (token != null && token.range[1] <= node.key.range[0]) {
            prefixes.push(token);
            token = tokenStore.getTokenAfter(token);
        }
        while (isLeftParen(last(prefixes)) || isLeftBracket(last(prefixes))) {
            prefixes.pop();
        }
        return prefixes;
    }
    function getChainHeadToken(node) {
        const { type } = node;
        while (node.parent && node.parent.type === type) {
            const prevToken = tokenStore.getTokenBefore(node);
            if (isLeftParen(prevToken)) {
                break;
            }
            node = node.parent;
        }
        return tokenStore.getFirstToken(node);
    }
    function isBeginningOfElement(token, belongingNode) {
        let node = belongingNode;
        while (node != null && node.parent != null) {
            const parent = node.parent;
            if (parent.type.endsWith('Statement') || parent.type.endsWith('Declaration')) {
                return parent.range[0] === token.range[0];
            }
            if (parent.type === 'XMustache') {
                if (node.range[0] !== token.range[0]) {
                    return false;
                }
                const prevToken = tokenStore.getTokenBefore(belongingNode);
                if (isLeftParen(prevToken)) {
                    return false;
                }
                return true;
            }
            if (parent.type === 'CallExpression' || parent.type === 'NewExpression') {
                const openParen = (tokenStore.getTokenAfter(parent.callee, isNotRightParen));
                return parent.arguments.some(param => getFirstAndLastTokens(param, openParen.range[1]).firstToken
                    .range[0] === token.range[0]);
            }
            if (parent.type === 'ArrayExpression') {
                return parent.elements.some(element => element != null
                    && getFirstAndLastTokens(element).firstToken.range[0]
                        === token.range[0]);
            }
            if (parent.type === 'SequenceExpression') {
                return parent.expressions.some(expr => getFirstAndLastTokens(expr).firstToken.range[0] === token.range[0]);
            }
            node = parent;
        }
        return false;
    }
    function processTopLevelNode(node, expectedIndent) {
        const token = tokenStore.getFirstToken(node);
        const offsetInfo = offsets.get(token);
        if (offsetInfo != null) {
            offsetInfo.expectedIndent = expectedIndent;
        }
        else {
            offsets.set(token, {
                baseToken: null,
                offset: 0,
                baseline: false,
                expectedIndent,
            });
        }
    }
    function ignore(node) {
        for (const token of tokenStore.getTokens(node)) {
            offsets.delete(token);
            ignoreTokens.add(token);
        }
    }
    function processIgnores(visitor) {
        for (const ignorePattern of options.ignores) {
            const key = `${ignorePattern}:exit`;
            if (visitor.hasOwnProperty(key)) {
                const handler = visitor[key];
                visitor[key] = function f(node, ...args) {
                    const ret = handler.call(this, node, ...args);
                    ignore(node);
                    return ret;
                };
            }
            else {
                visitor[key] = ignore;
            }
        }
        return visitor;
    }
    function getExpectedIndents(tokens) {
        const expectedIndents = [];
        for (let i = 0; i < tokens.length; ++i) {
            const token = tokens[i];
            const offsetInfo = offsets.get(token);
            if (offsetInfo != null) {
                if (offsetInfo.expectedIndent != null) {
                    expectedIndents.push(offsetInfo.expectedIndent);
                }
                else {
                    const baseOffsetInfo = offsets.get(offsetInfo.baseToken);
                    if (baseOffsetInfo != null
                        && baseOffsetInfo.expectedIndent != null
                        && (i === 0 || !baseOffsetInfo.baseline)) {
                        expectedIndents.push(+baseOffsetInfo.expectedIndent + offsetInfo.offset * options.indentSize);
                        if (baseOffsetInfo.baseline) {
                            break;
                        }
                    }
                }
            }
        }
        if (!expectedIndents.length) {
            return null;
        }
        return {
            expectedIndent: expectedIndents[0],
            expectedBaseIndent: expectedIndents.reduce((a, b) => Math.min(a, b)),
        };
    }
    function getIndentText(firstToken) {
        const { text } = sourceCode;
        let i = firstToken.range[0] - 1;
        while (i >= 0 && !LT_CHAR.test(text[i])) {
            i -= 1;
        }
        return text.slice(i + 1, firstToken.range[0]);
    }
    function defineFix(token, actualIndent, expectedIndent) {
        if (token.type === 'Block' && token.loc.start.line !== token.loc.end.line) {
            const lines = sourceCode.getText(token).match(LINES) || [];
            const firstLine = lines.shift();
            if (lines.every(l => BLOCK_COMMENT_PREFIX.test(l))) {
                return (fixer) => {
                    const range = [token.range[0] - actualIndent, token.range[1]];
                    const indent = options.indentChar.repeat(expectedIndent);
                    return fixer.replaceTextRange(range, `${indent}${firstLine}${lines
                        .map(l => l.replace(BLOCK_COMMENT_PREFIX, `${indent} *`))
                        .join('')}`);
                };
            }
        }
        return (fixer) => {
            const range = [token.range[0] - actualIndent, token.range[0]];
            const indent = options.indentChar.repeat(expectedIndent);
            return fixer.replaceTextRange(range, indent);
        };
    }
    function validateCore(token, expectedIndent, optionalExpectedIndents) {
        const { line } = token.loc.start;
        const indentText = getIndentText(token);
        if (indentText.trim() !== '') {
            return;
        }
        const actualIndent = token.loc.start.column;
        const unit = options.indentChar === '\t' ? 'tab' : 'space';
        for (let i = 0; i < indentText.length; ++i) {
            if (indentText[i] !== options.indentChar) {
                context.report({
                    loc: {
                        start: { line, column: i },
                        end: { line, column: i + 1 },
                    },
                    message: 'Expected {{expected}} character, but found {{actual}} character.',
                    data: {
                        expected: JSON.stringify(options.indentChar),
                        actual: JSON.stringify(indentText[i]),
                    },
                    fix: defineFix(token, actualIndent, expectedIndent),
                });
                return;
            }
        }
        if (actualIndent !== expectedIndent
            && (optionalExpectedIndents == null || !optionalExpectedIndents.includes(actualIndent))) {
            context.report({
                loc: {
                    start: { line, column: 0 },
                    end: { line, column: actualIndent },
                },
                message: 'Expected indentation of {{expectedIndent}} {{unit}}{{expectedIndentPlural}}'
                    + ' but found {{actualIndent}} {{unit}}{{actualIndentPlural}}.',
                data: {
                    expectedIndent: `${expectedIndent}`,
                    actualIndent: `${actualIndent}`,
                    unit,
                    expectedIndentPlural: expectedIndent === 1 ? '' : 's',
                    actualIndentPlural: actualIndent === 1 ? '' : 's',
                },
                fix: defineFix(token, actualIndent, expectedIndent),
            });
        }
    }
    function getCommentExpectedIndents(nextToken, nextExpectedIndent, lastExpectedIndent) {
        if (typeof lastExpectedIndent === 'number' && isClosingToken(nextToken)) {
            if (nextExpectedIndent === lastExpectedIndent) {
                return [nextExpectedIndent + options.indentSize, nextExpectedIndent];
            }
            return [lastExpectedIndent, nextExpectedIndent];
        }
        return [nextExpectedIndent];
    }
    function validate(tokens, comments, lastToken) {
        const firstToken = tokens[0];
        const actualIndent = firstToken.loc.start.column;
        const expectedIndents = getExpectedIndents(tokens);
        if (!expectedIndents) {
            return;
        }
        const { expectedBaseIndent } = expectedIndents;
        const { expectedIndent } = expectedIndents;
        const baseline = new Set();
        for (const token of tokens) {
            const offsetInfo = offsets.get(token);
            if (offsetInfo != null) {
                if (offsetInfo.baseline) {
                    if (options.indentChar === ' ') {
                        offsetInfo.expectedIndent = Math.max(0, token.loc.start.column + expectedBaseIndent - actualIndent);
                    }
                    else {
                        offsetInfo.expectedIndent = expectedBaseIndent + (token === tokens[0] ? 0 : 1);
                    }
                    baseline.add(token);
                }
                else if (baseline.has(offsetInfo.baseToken)) {
                    offsetInfo.expectedIndent = offsets.get(offsetInfo.baseToken).expectedIndent;
                    baseline.add(token);
                }
                else {
                    offsetInfo.expectedIndent = expectedBaseIndent;
                }
            }
        }
        if (ignoreTokens.has(firstToken)) {
            return;
        }
        const lastOffsetInfo = offsets.get(lastToken);
        const lastExpectedIndent = lastOffsetInfo && lastOffsetInfo.expectedIndent;
        const commentOptionalExpectedIndents = getCommentExpectedIndents(firstToken, expectedIndent, lastExpectedIndent);
        for (const comment of comments) {
            const commentExpectedIndents = getExpectedIndents([comment]);
            const commentExpectedIndent = commentExpectedIndents
                ? commentExpectedIndents.expectedIndent
                : commentOptionalExpectedIndents[0];
            validateCore(comment, commentExpectedIndent, commentOptionalExpectedIndents);
        }
        validateCore(firstToken, expectedIndent);
    }
    return processIgnores({
        XAttribute(node) {
            const keyToken = tokenStore.getFirstToken(node);
            const eqToken = tokenStore.getTokenAfter(node.key);
            if (eqToken != null && eqToken.range[1] <= node.range[1]) {
                setOffset(eqToken, 1, keyToken);
                const valueToken = tokenStore.getTokenAfter(eqToken);
                if (valueToken != null && valueToken.range[1] <= node.range[1]) {
                    setOffset(valueToken, 1, keyToken);
                }
            }
        },
        XElement(node) {
            if (!PREFORMATTED_ELEMENT_NAMES.includes(node.name)) {
                const isTopLevel = node.parent.type !== 'XElement';
                const offset = isTopLevel ? options.baseIndent : 1;
                processNodeList(node.children.filter(isNotEmptyTextNode), node.startTag, node.endTag, offset, false);
            }
            else {
                const startTagToken = tokenStore.getFirstToken(node);
                const endTagToken = node.endTag && tokenStore.getFirstToken(node.endTag);
                setOffset(endTagToken, 0, startTagToken);
                setPreformattedTokens(node);
            }
        },
        XEndTag(node) {
            const element = node.parent;
            const startTagOpenToken = tokenStore.getFirstToken(element.startTag);
            const closeToken = tokenStore.getLastToken(node);
            if (closeToken.type.endsWith('TagClose')) {
                setOffset(closeToken, options.closeBracket.endTag, startTagOpenToken);
            }
        },
        XMustache(node) {
            if (node.value != null && node.range[0] !== node.value.range[0]) {
                const startQuoteToken = tokenStore.getFirstToken(node);
                const endQuoteToken = tokenStore.getLastToken(node);
                const childToken = tokenStore.getTokenAfter(startQuoteToken);
                setOffset(childToken, 1, startQuoteToken);
                setOffset(endQuoteToken, 0, startQuoteToken);
            }
        },
        XModule(node) {
            const baseIndent = options.indentSize * (options.scriptBaseIndent || 0);
            if (node.body != null) {
                for (const childNode of node.body) {
                    processTopLevelNode(childNode, baseIndent);
                }
            }
        },
        XStartTag(node) {
            const openToken = tokenStore.getFirstToken(node);
            const closeToken = tokenStore.getLastToken(node);
            processNodeList(node.attributes, openToken, null, options.attribute, options.alignAttributesVertically);
            if (closeToken != null && closeToken.type.endsWith('TagClose')) {
                const offset = closeToken.type !== 'HTMLSelfClosingTagClose'
                    ? options.closeBracket.startTag
                    : options.closeBracket.selfClosingTag;
                setOffset(closeToken, offset, openToken);
            }
        },
        XText(node) {
            const tokens = tokenStore.getTokens(node, isNotWhitespace);
            const firstTokenInfo = offsets.get(tokenStore.getFirstToken(node));
            for (const token of tokens) {
                offsets.set(token, Object.assign({}, firstTokenInfo));
            }
        },
        'ArrayExpression, ArrayPattern'(node) {
            processNodeList(node.elements, tokenStore.getFirstToken(node), tokenStore.getLastToken(node), 1);
        },
        ArrowFunctionExpression(node) {
            const firstToken = tokenStore.getFirstToken(node);
            const secondToken = tokenStore.getTokenAfter(firstToken);
            const leftToken = node.async ? secondToken : firstToken;
            const arrowToken = tokenStore.getTokenBefore(node.body, isArrow);
            if (node.async) {
                setOffset(secondToken, 1, firstToken);
            }
            if (isLeftParen(leftToken)) {
                const rightToken = tokenStore.getTokenAfter((last(node.params) || leftToken), isRightParen);
                processNodeList(node.params, leftToken, rightToken, 1);
            }
            setOffset(arrowToken, 1, firstToken);
            processMaybeBlock(node.body, firstToken);
        },
        'AssignmentExpression, AssignmentPattern, BinaryExpression, LogicalExpression'(node) {
            const leftToken = getChainHeadToken(node);
            const opToken = (tokenStore.getTokenAfter(node.left, isNotRightParen));
            const rightToken = tokenStore.getTokenAfter(opToken);
            const prevToken = tokenStore.getTokenBefore(leftToken);
            const shouldIndent = prevToken == null || prevToken.loc.end.line === leftToken.loc.start.line
                || isBeginningOfElement(leftToken, node);
            setOffset([opToken, rightToken], shouldIndent ? 1 : 0, leftToken);
        },
        'AwaitExpression, RestElement, SpreadElement, UnaryExpression'(node) {
            const firstToken = tokenStore.getFirstToken(node);
            const nextToken = tokenStore.getTokenAfter(firstToken);
            setOffset(nextToken, 1, firstToken);
        },
        'BlockStatement, ClassBody'(node) {
            processNodeList(node.body, tokenStore.getFirstToken(node), tokenStore.getLastToken(node), 1);
        },
        'BreakStatement, ContinueStatement, ReturnStatement, ThrowStatement'(node) {
            if (((node.type === 'ReturnStatement' || node.type === 'ThrowStatement') && node.argument != null)
                || ((node.type === 'BreakStatement' || node.type === 'ContinueStatement')
                    && node.label != null)) {
                const firstToken = tokenStore.getFirstToken(node);
                const nextToken = tokenStore.getTokenAfter(firstToken);
                setOffset(nextToken, 1, firstToken);
            }
        },
        CallExpression(node) {
            const firstToken = tokenStore.getFirstToken(node);
            const rightToken = tokenStore.getLastToken(node);
            const leftToken = tokenStore.getTokenAfter(node.callee, isLeftParen);
            setOffset(leftToken, 1, firstToken);
            processNodeList(node.arguments, leftToken, rightToken, 1);
        },
        ImportExpression(node) {
            const firstToken = tokenStore.getFirstToken(node);
            const rightToken = tokenStore.getLastToken(node);
            const leftToken = tokenStore.getTokenAfter(firstToken, isLeftParen);
            setOffset(leftToken, 1, firstToken);
            processNodeList([node.source], leftToken, rightToken, 1);
        },
        CatchClause(node) {
            const firstToken = tokenStore.getFirstToken(node);
            const bodyToken = tokenStore.getFirstToken(node.body);
            if (node.param != null) {
                const leftToken = tokenStore.getTokenAfter(firstToken);
                const rightToken = tokenStore.getTokenAfter(node.param);
                setOffset(leftToken, 1, firstToken);
                processNodeList([node.param], leftToken, rightToken, 1);
            }
            setOffset(bodyToken, 0, firstToken);
        },
        'ClassDeclaration, ClassExpression'(node) {
            const firstToken = tokenStore.getFirstToken(node);
            const bodyToken = tokenStore.getFirstToken(node.body);
            if (node.id != null) {
                setOffset(tokenStore.getFirstToken(node.id), 1, firstToken);
            }
            if (node.superClass != null) {
                const extendsToken = tokenStore.getTokenAfter(node.id || firstToken);
                const superClassToken = tokenStore.getTokenAfter(extendsToken);
                setOffset(extendsToken, 1, firstToken);
                setOffset(superClassToken, 1, extendsToken);
            }
            setOffset(bodyToken, 0, firstToken);
        },
        ConditionalExpression(node) {
            const prevToken = tokenStore.getTokenBefore(node);
            const firstToken = tokenStore.getFirstToken(node);
            const questionToken = (tokenStore.getTokenAfter(node.test, isNotRightParen));
            const consequentToken = tokenStore.getTokenAfter(questionToken);
            const colonToken = (tokenStore.getTokenAfter(node.consequent, isNotRightParen));
            const alternateToken = tokenStore.getTokenAfter(colonToken);
            const isFlat = prevToken
                && prevToken.loc.end.line !== node.loc.start.line
                && node.test.loc.end.line === node.consequent.loc.start.line;
            if (isFlat) {
                setOffset([questionToken, consequentToken, colonToken, alternateToken], 0, firstToken);
            }
            else {
                setOffset([questionToken, colonToken], 1, firstToken);
                setOffset([consequentToken, alternateToken], 1, questionToken);
            }
        },
        DoWhileStatement(node) {
            const doToken = tokenStore.getFirstToken(node);
            const whileToken = (tokenStore.getTokenAfter(node.body, isNotRightParen));
            const leftToken = tokenStore.getTokenAfter(whileToken);
            const testToken = tokenStore.getTokenAfter(leftToken);
            const lastToken = tokenStore.getLastToken(node);
            const rightToken = isSemicolon(lastToken)
                ? tokenStore.getTokenBefore(lastToken)
                : lastToken;
            processMaybeBlock(node.body, doToken);
            setOffset(whileToken, 0, doToken);
            setOffset(leftToken, 1, whileToken);
            setOffset(testToken, 1, leftToken);
            setOffset(rightToken, 0, leftToken);
        },
        ExportAllDeclaration(node) {
            const tokens = tokenStore.getTokens(node);
            const firstToken = (tokens.shift());
            if (isSemicolon(last(tokens))) {
                tokens.pop();
            }
            if (!node.exported) {
                setOffset(tokens, 1, firstToken);
            }
            else {
                const starToken = (tokens.find(isWildcard));
                const asToken = tokenStore.getTokenAfter(starToken);
                const exportedToken = tokenStore.getTokenAfter(asToken);
                const afterTokens = tokens.slice(tokens.indexOf(exportedToken) + 1);
                setOffset(starToken, 1, firstToken);
                setOffset(asToken, 1, starToken);
                setOffset(exportedToken, 1, starToken);
                setOffset(afterTokens, 1, firstToken);
            }
        },
        ExportDefaultDeclaration(node) {
            const exportToken = tokenStore.getFirstToken(node);
            const defaultToken = tokenStore.getFirstToken(node, 1);
            const declarationToken = getFirstAndLastTokens(node.declaration)
                .firstToken;
            setOffset([defaultToken, declarationToken], 1, exportToken);
        },
        ExportNamedDeclaration(node) {
            const exportToken = tokenStore.getFirstToken(node);
            if (node.declaration) {
                const declarationToken = tokenStore.getFirstToken(node, 1);
                setOffset(declarationToken, 1, exportToken);
            }
            else {
                const firstSpecifier = node.specifiers[0];
                if (!firstSpecifier || firstSpecifier.type === 'ExportSpecifier') {
                    const leftParenToken = tokenStore.getFirstToken(node, 1);
                    const rightParenToken = (tokenStore.getLastToken(node, isRightBrace));
                    setOffset(leftParenToken, 0, exportToken);
                    processNodeList(node.specifiers, leftParenToken, rightParenToken, 1);
                    const maybeFromToken = tokenStore.getTokenAfter(rightParenToken);
                    if (maybeFromToken != null && sourceCode.getText(maybeFromToken) === 'from') {
                        const fromToken = maybeFromToken;
                        const nameToken = tokenStore.getTokenAfter(fromToken);
                        setOffset([fromToken, nameToken], 1, exportToken);
                    }
                }
            }
        },
        ExportSpecifier(node) {
            const tokens = tokenStore.getTokens(node);
            const firstToken = (tokens.shift());
            setOffset(tokens, 1, firstToken);
        },
        'ForInStatement, ForOfStatement'(node) {
            const forToken = tokenStore.getFirstToken(node);
            const awaitToken = (node.type === 'ForOfStatement'
                && node.await
                && tokenStore.getTokenAfter(forToken))
                || null;
            const leftParenToken = tokenStore.getTokenAfter(awaitToken || forToken);
            const leftToken = tokenStore.getTokenAfter(leftParenToken);
            const inToken = (tokenStore.getTokenAfter(leftToken, isNotRightParen));
            const rightToken = tokenStore.getTokenAfter(inToken);
            const rightParenToken = tokenStore.getTokenBefore(node.body, isNotLeftParen);
            if (awaitToken != null) {
                setOffset(awaitToken, 0, forToken);
            }
            setOffset(leftParenToken, 1, forToken);
            setOffset(leftToken, 1, leftParenToken);
            setOffset(inToken, 1, leftToken);
            setOffset(rightToken, 1, leftToken);
            setOffset(rightParenToken, 0, leftParenToken);
            processMaybeBlock(node.body, forToken);
        },
        ForStatement(node) {
            const forToken = tokenStore.getFirstToken(node);
            const leftParenToken = tokenStore.getTokenAfter(forToken);
            const rightParenToken = tokenStore.getTokenBefore(node.body, isNotLeftParen);
            setOffset(leftParenToken, 1, forToken);
            processNodeList([node.init, node.test, node.update], leftParenToken, rightParenToken, 1);
            processMaybeBlock(node.body, forToken);
        },
        'FunctionDeclaration, FunctionExpression'(node) {
            const firstToken = tokenStore.getFirstToken(node);
            if (isLeftParen(firstToken)) {
                const leftToken = firstToken;
                const rightToken = tokenStore.getTokenAfter(last(node.params) || leftToken, isRightParen);
                const bodyToken = tokenStore.getFirstToken(node.body);
                processNodeList(node.params, leftToken, rightToken, 1);
                setOffset(bodyToken, 0, tokenStore.getFirstToken(node.parent));
            }
            else {
                const functionToken = node.async
                    ? tokenStore.getTokenAfter(firstToken)
                    : firstToken;
                const starToken = node.generator
                    ? tokenStore.getTokenAfter(functionToken)
                    : null;
                const idToken = node.id && tokenStore.getFirstToken(node.id);
                const leftToken = tokenStore.getTokenAfter(idToken || starToken || functionToken);
                const rightToken = tokenStore.getTokenAfter(last(node.params) || leftToken, isRightParen);
                const bodyToken = tokenStore.getFirstToken(node.body);
                if (node.async) {
                    setOffset(functionToken, 0, firstToken);
                }
                if (node.generator) {
                    setOffset(starToken, 1, firstToken);
                }
                if (node.id != null) {
                    setOffset(idToken, 1, firstToken);
                }
                setOffset(leftToken, 1, firstToken);
                processNodeList(node.params, leftToken, rightToken, 1);
                setOffset(bodyToken, 0, firstToken);
            }
        },
        IfStatement(node) {
            const ifToken = tokenStore.getFirstToken(node);
            const ifLeftParenToken = tokenStore.getTokenAfter(ifToken);
            const ifRightParenToken = tokenStore.getTokenBefore(node.consequent, isRightParen);
            setOffset(ifLeftParenToken, 1, ifToken);
            setOffset(ifRightParenToken, 0, ifLeftParenToken);
            processMaybeBlock(node.consequent, ifToken);
            if (node.alternate != null) {
                const elseToken = (tokenStore.getTokenAfter(node.consequent, isNotRightParen));
                setOffset(elseToken, 0, ifToken);
                processMaybeBlock(node.alternate, elseToken);
            }
        },
        ImportDeclaration(node) {
            const firstSpecifier = node.specifiers[0];
            const secondSpecifier = node.specifiers[1];
            const importToken = tokenStore.getFirstToken(node);
            const hasSemi = tokenStore.getLastToken(node).value === ';';
            const tokens = [];
            if (!firstSpecifier) {
                const secondToken = tokenStore.getFirstToken(node, 1);
                if (isLeftBrace(secondToken)) {
                    setOffset([secondToken, tokenStore.getTokenAfter(secondToken)], 0, importToken);
                    tokens.push(tokenStore.getLastToken(node, hasSemi ? 2 : 1), tokenStore.getLastToken(node, hasSemi ? 1 : 0));
                }
                else {
                    tokens.push(tokenStore.getLastToken(node, hasSemi ? 1 : 0));
                }
            }
            else if (firstSpecifier.type === 'ImportDefaultSpecifier') {
                if (secondSpecifier && secondSpecifier.type === 'ImportNamespaceSpecifier') {
                    tokens.push(tokenStore.getFirstToken(firstSpecifier), tokenStore.getTokenAfter(firstSpecifier), tokenStore.getFirstToken(secondSpecifier), tokenStore.getLastToken(node, hasSemi ? 2 : 1), tokenStore.getLastToken(node, hasSemi ? 1 : 0));
                }
                else {
                    const idToken = tokenStore.getFirstToken(firstSpecifier);
                    const nextToken = tokenStore.getTokenAfter(firstSpecifier);
                    if (isComma(nextToken)) {
                        const leftBrace = tokenStore.getTokenAfter(nextToken);
                        const rightBrace = tokenStore.getLastToken(node, hasSemi ? 3 : 2);
                        setOffset([idToken, nextToken], 1, importToken);
                        setOffset(leftBrace, 0, idToken);
                        processNodeList(node.specifiers.slice(1), leftBrace, rightBrace, 1);
                        tokens.push(tokenStore.getLastToken(node, hasSemi ? 2 : 1), tokenStore.getLastToken(node, hasSemi ? 1 : 0));
                    }
                    else {
                        tokens.push(idToken, nextToken, tokenStore.getTokenAfter(nextToken));
                    }
                }
            }
            else if (firstSpecifier.type === 'ImportNamespaceSpecifier') {
                tokens.push(tokenStore.getFirstToken(firstSpecifier), tokenStore.getLastToken(node, hasSemi ? 2 : 1), tokenStore.getLastToken(node, hasSemi ? 1 : 0));
            }
            else {
                const leftBrace = tokenStore.getFirstToken(node, 1);
                const rightBrace = tokenStore.getLastToken(node, hasSemi ? 3 : 2);
                setOffset(leftBrace, 0, importToken);
                processNodeList(node.specifiers, leftBrace, rightBrace, 1);
                tokens.push(tokenStore.getLastToken(node, hasSemi ? 2 : 1), tokenStore.getLastToken(node, hasSemi ? 1 : 0));
            }
            setOffset(tokens, 1, importToken);
        },
        ImportSpecifier(node) {
            if (node.local.range[0] !== node.imported.range[0]) {
                const tokens = tokenStore.getTokens(node);
                const firstToken = (tokens.shift());
                setOffset(tokens, 1, firstToken);
            }
        },
        ImportNamespaceSpecifier(node) {
            const tokens = tokenStore.getTokens(node);
            const firstToken = (tokens.shift());
            setOffset(tokens, 1, firstToken);
        },
        LabeledStatement(node) {
            const labelToken = tokenStore.getFirstToken(node);
            const colonToken = tokenStore.getTokenAfter(labelToken);
            const bodyToken = tokenStore.getTokenAfter(colonToken);
            setOffset([colonToken, bodyToken], 1, labelToken);
        },
        'MemberExpression, MetaProperty'(node) {
            const objectToken = tokenStore.getFirstToken(node);
            if (node.type === 'MemberExpression' && node.computed) {
                const leftBracketToken = (tokenStore.getTokenBefore(node.property, isLeftBracket));
                const propertyToken = tokenStore.getTokenAfter(leftBracketToken);
                const rightBracketToken = tokenStore.getTokenAfter(node.property, isRightBracket);
                setOffset(leftBracketToken, 1, objectToken);
                setOffset(propertyToken, 1, leftBracketToken);
                setOffset(rightBracketToken, 0, leftBracketToken);
            }
            else {
                const dotToken = tokenStore.getTokenBefore(node.property);
                const propertyToken = tokenStore.getTokenAfter(dotToken);
                setOffset([dotToken, propertyToken], 1, objectToken);
            }
        },
        'MethodDefinition, Property'(node) {
            const isMethod = node.type === 'MethodDefinition' || node.method === true;
            const prefixTokens = getPrefixTokens(node);
            const hasPrefix = prefixTokens.length >= 1;
            for (let i = 1; i < prefixTokens.length; ++i) {
                setOffset(prefixTokens[i], 0, prefixTokens[i - 1]);
            }
            let lastKeyToken = null;
            if (node.computed) {
                const keyLeftToken = (tokenStore.getFirstToken(node, isLeftBracket));
                const keyToken = tokenStore.getTokenAfter(keyLeftToken);
                const keyRightToken = (lastKeyToken = (tokenStore.getTokenAfter(node.key, isRightBracket)));
                if (hasPrefix) {
                    setOffset(keyLeftToken, 0, (last(prefixTokens)));
                }
                setOffset(keyToken, 1, keyLeftToken);
                setOffset(keyRightToken, 0, keyLeftToken);
            }
            else {
                const idToken = (lastKeyToken = tokenStore.getFirstToken(node.key));
                if (hasPrefix) {
                    setOffset(idToken, 0, (last(prefixTokens)));
                }
            }
            if (isMethod) {
                const leftParenToken = tokenStore.getTokenAfter(lastKeyToken);
                setOffset(leftParenToken, 1, lastKeyToken);
            }
            else if (node.type === 'Property' && !node.shorthand) {
                const colonToken = tokenStore.getTokenAfter(lastKeyToken);
                const valueToken = tokenStore.getTokenAfter(colonToken);
                setOffset([colonToken, valueToken], 1, lastKeyToken);
            }
        },
        NewExpression(node) {
            const newToken = tokenStore.getFirstToken(node);
            const calleeToken = tokenStore.getTokenAfter(newToken);
            const rightToken = tokenStore.getLastToken(node);
            const leftToken = isRightParen(rightToken)
                ? tokenStore.getFirstTokenBetween(node.callee, rightToken, isLeftParen)
                : null;
            setOffset(calleeToken, 1, newToken);
            if (leftToken != null) {
                setOffset(leftToken, 1, calleeToken);
                processNodeList(node.arguments, leftToken, rightToken, 1);
            }
        },
        'ObjectExpression, ObjectPattern'(node) {
            processNodeList(node.properties, tokenStore.getFirstToken(node), tokenStore.getLastToken(node), 1);
        },
        SequenceExpression(node) {
            processNodeList(node.expressions, null, null, 0);
        },
        SwitchCase(node) {
            const caseToken = tokenStore.getFirstToken(node);
            if (node.test != null) {
                const testToken = tokenStore.getTokenAfter(caseToken);
                const colonToken = tokenStore.getTokenAfter(node.test, isNotRightParen);
                setOffset([testToken, colonToken], 1, caseToken);
            }
            else {
                const colonToken = tokenStore.getTokenAfter(caseToken);
                setOffset(colonToken, 1, caseToken);
            }
            if (node.consequent.length === 1 && node.consequent[0].type === 'BlockStatement') {
                setOffset(tokenStore.getFirstToken(node.consequent[0]), 0, caseToken);
            }
            else if (node.consequent.length >= 1) {
                setOffset(tokenStore.getFirstToken(node.consequent[0]), 1, caseToken);
                processNodeList(node.consequent, null, null, 0);
            }
        },
        SwitchStatement(node) {
            const switchToken = tokenStore.getFirstToken(node);
            const leftParenToken = tokenStore.getTokenAfter(switchToken);
            const discriminantToken = tokenStore.getTokenAfter(leftParenToken);
            const leftBraceToken = (tokenStore.getTokenAfter(node.discriminant, isLeftBrace));
            const rightParenToken = tokenStore.getTokenBefore(leftBraceToken);
            const rightBraceToken = tokenStore.getLastToken(node);
            setOffset(leftParenToken, 1, switchToken);
            setOffset(discriminantToken, 1, leftParenToken);
            setOffset(rightParenToken, 0, leftParenToken);
            setOffset(leftBraceToken, 0, switchToken);
            processNodeList(node.cases, leftBraceToken, rightBraceToken, options.switchCase);
        },
        TaggedTemplateExpression(node) {
            const tagTokens = getFirstAndLastTokens(node.tag, node.range[0]);
            const quasiToken = tokenStore.getTokenAfter(tagTokens.lastToken);
            setOffset(quasiToken, 1, tagTokens.firstToken);
        },
        TemplateLiteral(node) {
            const firstToken = tokenStore.getFirstToken(node);
            const quasiTokens = node.quasis
                .slice(1)
                .map(n => tokenStore.getFirstToken(n));
            const expressionToken = node.quasis
                .slice(0, -1)
                .map(n => tokenStore.getTokenAfter(n));
            setOffset(quasiTokens, 0, firstToken);
            setOffset(expressionToken, 1, firstToken);
        },
        TryStatement(node) {
            const tryToken = tokenStore.getFirstToken(node);
            const tryBlockToken = tokenStore.getFirstToken(node.block);
            setOffset(tryBlockToken, 0, tryToken);
            if (node.handler != null) {
                const catchToken = tokenStore.getFirstToken(node.handler);
                setOffset(catchToken, 0, tryToken);
            }
            if (node.finalizer != null) {
                const finallyToken = tokenStore.getTokenBefore(node.finalizer);
                const finallyBlockToken = tokenStore.getFirstToken(node.finalizer);
                setOffset([finallyToken, finallyBlockToken], 0, tryToken);
            }
        },
        UpdateExpression(node) {
            const firstToken = tokenStore.getFirstToken(node);
            const nextToken = tokenStore.getTokenAfter(firstToken);
            setOffset(nextToken, 1, firstToken);
        },
        VariableDeclaration(node) {
            processNodeList(node.declarations, tokenStore.getFirstToken(node), null, 1);
        },
        VariableDeclarator(node) {
            if (node.init != null) {
                const idToken = tokenStore.getFirstToken(node);
                const eqToken = tokenStore.getTokenAfter(node.id);
                const initToken = tokenStore.getTokenAfter(eqToken);
                setOffset([eqToken, initToken], 1, idToken);
            }
        },
        'WhileStatement, WithStatement'(node) {
            const firstToken = tokenStore.getFirstToken(node);
            const leftParenToken = tokenStore.getTokenAfter(firstToken);
            const rightParenToken = tokenStore.getTokenBefore(node.body, isRightParen);
            setOffset(leftParenToken, 1, firstToken);
            setOffset(rightParenToken, 0, leftParenToken);
            processMaybeBlock(node.body, firstToken);
        },
        YieldExpression(node) {
            if (node.argument != null) {
                const yieldToken = tokenStore.getFirstToken(node);
                setOffset(tokenStore.getTokenAfter(yieldToken), 1, yieldToken);
                if (node.delegate) {
                    setOffset(tokenStore.getTokenAfter(yieldToken, 1), 1, yieldToken);
                }
            }
        },
        ':statement'(node) {
            const firstToken = tokenStore.getFirstToken(node);
            const lastToken = tokenStore.getLastToken(node);
            if (isSemicolon(lastToken) && firstToken !== lastToken) {
                setOffset(lastToken, 0, firstToken);
            }
            const info = offsets.get(firstToken);
            const prevToken = tokenStore.getTokenBefore(firstToken);
            if (info != null && isSemicolon(prevToken) && prevToken.loc.end.line === firstToken.loc.start.line) {
                offsets.set(prevToken, info);
            }
        },
        ':expression, MetaProperty, TemplateLiteral'(node) {
            let leftToken = tokenStore.getTokenBefore(node);
            let rightToken = tokenStore.getTokenAfter(node);
            let firstToken = tokenStore.getFirstToken(node);
            while (isLeftParen(leftToken) && isRightParen(rightToken)) {
                setOffset(firstToken, 1, leftToken);
                setOffset(rightToken, 0, leftToken);
                firstToken = leftToken;
                leftToken = tokenStore.getTokenBefore(leftToken);
                rightToken = tokenStore.getTokenAfter(rightToken);
            }
        },
        '*:exit'(node) {
            if (!KNOWN_NODES.has(node.type) && !NON_STANDARD_KNOWN_NODES.has(node.type)) {
                ignore(node);
            }
        },
        'XElement[parent.type!=\'XElement\']'(node) {
            processTopLevelNode(node, 0);
        },
        ':matches(Program, XElement[parent.type!=\'XElement\']):exit'(node) {
            let comments = [];
            let tokensOnSameLine = [];
            let isBesideMultilineToken = false;
            let lastValidatedToken = null;
            for (const token of tokenStore.getTokens(node, ITERATION_OPTS)) {
                if (tokensOnSameLine.length === 0 || tokensOnSameLine[0].loc.start.line === token.loc.start.line) {
                    tokensOnSameLine.push(token);
                }
                else if (tokensOnSameLine.every(isComment)) {
                    comments.push(tokensOnSameLine[0]);
                    isBesideMultilineToken = (last(tokensOnSameLine)).loc.end.line === token.loc.start.line;
                    tokensOnSameLine = [token];
                }
                else {
                    if (!isBesideMultilineToken) {
                        validate(tokensOnSameLine, comments, lastValidatedToken);
                        lastValidatedToken = tokensOnSameLine[0];
                    }
                    isBesideMultilineToken = (last(tokensOnSameLine)).loc.end.line === token.loc.start.line;
                    tokensOnSameLine = [token];
                    comments = [];
                }
            }
            if (tokensOnSameLine.length >= 1 && tokensOnSameLine.some(isNotComment)) {
                validate(tokensOnSameLine, comments, lastValidatedToken);
            }
        },
    });
};

var xmlIndent = {
    create(context) {
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
                anyOf: [{ type: 'integer', minimum: 1 }, { enum: ['tab'] }],
            },
            {
                type: 'object',
                properties: {
                    attribute: { type: 'integer', minimum: 0 },
                    baseIndent: { type: 'integer', minimum: 0 },
                    scriptBaseIndent: { type: 'integer', minimum: 0 },
                    closeBracket: {
                        anyOf: [
                            { type: 'integer', minimum: 0 },
                            {
                                type: 'object',
                                properties: {
                                    startTag: { type: 'integer', minimum: 0 },
                                    endTag: { type: 'integer', minimum: 0 },
                                    selfClosingTag: { type: 'integer', minimum: 0 },
                                },
                                additionalProperties: false,
                            },
                        ],
                    },
                    switchCase: { type: 'integer', minimum: 0 },
                    alignAttributesVertically: { type: 'boolean' },
                    ignores: {
                        type: 'array',
                        items: {
                            allOf: [
                                { type: 'string' },
                                { not: { type: 'string', pattern: ':exit$' } },
                                { not: { type: 'string', pattern: '^\\s*$' } },
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

var rules = {
    'array-bracket-spacing': arrayBracketSpacing,
    'arrow-spacing': arrowSpacing,
    'comment-directive': commentDirective,
    'dot-location': dotLocation,
    'dot-notation': dotNotation,
    'eqeqeq': eqeqeq,
    'filter-name': filterName,
    'func-call-spacing': funcCallSpacing,
    'html-end-tag': htmlEndTag,
    'key-spacing': keySpacing,
    'keyword-spacing': keywordSpacing,
    'mustache-interpolation-spacing': mustacheInterpolationSpacing,
    'no-confusing-for-if': noConfusingForIf,
    'no-duplicate-attributes': noDuplicateAttributes,
    'no-multi-spaces': noMultiSpaces,
    'no-parsing-error': noParsingError,
    'no-unary-operator': noUnaryOperator,
    'no-useless-concat': noUselessConcat,
    'no-useless-mustache': noUselessMustache,
    'template-name': templateName,
    'valid-bind': validBind,
    'valid-component-nesting': validComponentNesting,
    'valid-elif': validElif,
    'valid-else': validElse,
    'valid-for': validFor,
    'valid-if': validIf,
    'xml-indent': xmlIndent,
};

const configs = {
    base,
    recommended,
    strict,
};
const processors = {
    '.swan': swanParser,
};
const environments = {
    globals: { globals },
};

exports.configs = configs;
exports.environments = environments;
exports.processors = processors;
exports.rules = rules;
