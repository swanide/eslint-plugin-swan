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
            if (message.ruleId === 'swan/comment-directive') {
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
            plugins: ['eslint-plugin-swan'],
            parser: require.resolve('@baidu/swan-eslint-parser'),
            env: {
                'browser': true,
                'es6': true,
                'swan/globals': true,
            },
            rules: {
                'indent': 0,
                'no-multi-spaces': 0,
                'import/unambiguous': 0,
                'babel/new-cap': 0,
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
                'swan/comment-directive': 2,
                'swan/no-parsing-error': 2,
                'swan/no-duplicate-attributes': 2,
                'swan/no-useless-mustache': [2, { ignoreStringEscape: true }],
                'swan/valid-for': 2,
                'swan/valid-if': 2,
                'swan/valid-elif': 2,
                'swan/valid-else': 2,
                'swan/no-confusing-for-if': 2,
                'swan/html-end-tag': 2,
                'swan/valid-bind': 2,
            },
        },
    ],
    globals,
};

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
const _a = base.overrides[0], { rules: baseRules } = _a, baseOverwritesSwan = __rest(_a, ["rules"]);
var recommended = Object.assign(Object.assign({}, base), { overrides: [
        Object.assign(Object.assign({}, baseOverwritesSwan), { rules: Object.assign(Object.assign({}, baseRules), { 'max-len': [1, 120], 'swan/no-multi-spaces': 1, 'swan/valid-component-nesting': [1, { allowEmptyBlock: true, ignoreEmptyBlock: ['view'] }], 'swan/mustache-interpolation-spacing': [1, 'never'], 'swan/array-bracket-spacing': 2, 'swan/arrow-spacing': 2, 'swan/dot-location': [2, 'property'], 'swan/dot-notation': 2, 'swan/key-spacing': 2, 'swan/keyword-spacing': 2, 'swan/no-useless-concat': 2 }) }),
    ] });

const emptyTextReg = /^\s*$/;
const isSwanFile = (filename) => filename.endsWith('.swan');
const getRuleUrl = (name) => `https://smartprogram.baidu.com/docs/develop/rules/${name}.md`;
let ruleMap = null;
function getCoreRule(name) {
    const map = ruleMap
        || (ruleMap = new (require('eslint').Linter)()
            .getRules());
    return map.get(name) || require(`eslint/lib/rules/${name}`);
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
                    newKey = key.replace(/\bProgram\b/g, 'XExpressionContainer');
                }
                else {
                    newKey = key.replace(/^|(?<=,)/g, 'XExpressionContainer ');
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
            unexpected: 'missing end tag',
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
                        message: '\'<{{name}}>\' should have end tag.',
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
                    || closeBrace.type !== 'XMustacheEnd') {
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
                            fix: fixer => fixer.insertTextAfter(openBrace, ' '),
                        });
                    }
                    if (closeBrace.range[0] === lastToken.range[1]) {
                        context.report({
                            node: closeBrace,
                            message: 'Expected 1 space before \'}}\', but not found.',
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
                            message: 'Expected no space after \'{{\', but found.',
                            fix: fixer => fixer.removeRange([openBrace.range[1], firstToken.range[0]]),
                        });
                    }
                    if (closeBrace.range[0] !== lastToken.range[1]) {
                        context.report({
                            loc: {
                                start: lastToken.loc.end,
                                end: closeBrace.loc.end,
                            },
                            message: 'Expected no space before \'}}\', but found.',
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
        type: 'suggestion',
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
                if (hasDirective(element, 'for') || hasDirective(element, 'for-items')) {
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
                            message: `'${prefix}if' should move to the wrapper element.`,
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
                        message: 'Duplicate directive \'{{name}}\'.',
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
                    message: `Multiple spaces found before '${sourceCode.getText(token)}'.`,
                    fix: fixer => fixer.replaceTextRange([prevToken.range[1], token.range[0]], ' '),
                });
            }
            prevToken = token;
        }
        return {};
    },
};

const DEFAULT_OPTIONS = Object.freeze(Object.assign(Object.create(null), {
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
}));
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
                    context.report({
                        node,
                        loc: { line: error.lineNumber, column: error.column },
                        message: 'Parsing error: {{message}}.',
                        data: {
                            message: error.message.endsWith('.')
                                ? error.message.slice(0, -1)
                                : error.message,
                        },
                    });
                }
            },
        };
    },
};

var noUselessConcat = wrapCoreRule('no-useless-concat');

function stripQuotesForHTML(text) {
    if ((text[0] === '"' || text[0] === '\'' || text[0] === '`') && text[0] === text[text.length - 1]) {
        return text.slice(1, -1);
    }
    return null;
}
var noUselessMustache = {
    meta: {
        docs: {
            description: 'disallow unnecessary mustache interpolations',
            categories: ['essential'],
            url: getRuleUrl('no-useless-mustache'),
        },
        fixable: 'code',
        messages: {
            unexpected: 'Unexpected mustache interpolation with a string literal value.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreIncludesComment: {
                        type: 'boolean',
                    },
                    ignoreStringEscape: {
                        type: 'boolean',
                    },
                },
            },
        ],
        type: 'suggestion',
    },
    create(context) {
        const opts = context.options[0] || {};
        const { ignoreIncludesComment } = opts;
        const { ignoreStringEscape } = opts;
        function verify(node) {
            const { expression } = node.value;
            const sourceCode = context.getSourceCode();
            const content = sourceCode.getText().slice(node.range[0], node.range[1]);
            if (!expression) {
                if (content.search(/^\{\{\s*\}\}$/) !== -1) {
                    context.report({
                        node,
                        message: 'Unexpected empty mustache interpolation.',
                        loc: node.loc,
                        fix: fixer => fixer.removeRange(node.range),
                    });
                }
                return;
            }
            let strValue = '';
            let rawValue = '';
            if (expression.type === 'Literal') {
                if (typeof expression.value !== 'string') {
                    return;
                }
                strValue = expression.value;
                rawValue = expression.raw;
            }
            else if (expression.type === 'TemplateLiteral') {
                if (expression.expressions.length > 0) {
                    return;
                }
                strValue = expression.quasis[0].value.cooked;
                rawValue = expression.quasis[0].value.raw;
            }
            else {
                return;
            }
            const tokenStore = context.parserServices.getTemplateBodyTokenStore();
            const hasComment = tokenStore
                .getTokens(node, { includeComments: true })
                .some(t => t.type === 'Block' || t.type === 'Line');
            if (ignoreIncludesComment && hasComment) {
                return;
            }
            let hasEscape = false;
            if (rawValue !== strValue) {
                const chars = [...rawValue];
                let c = chars.shift();
                while (c) {
                    if (c === '\\') {
                        c = chars.shift();
                        if (c == null || 'nrvtbfux'.includes(c)) {
                            hasEscape = true;
                            break;
                        }
                    }
                    c = chars.shift();
                }
            }
            if (ignoreStringEscape && hasEscape) {
                return;
            }
            context.report({
                node,
                messageId: 'unexpected',
                loc: node.loc,
                fix(fixer) {
                    if (hasComment || hasEscape) {
                        return null;
                    }
                    const text = expression.raw ? stripQuotesForHTML(expression.raw) : null;
                    if (text == null) {
                        return null;
                    }
                    if (text.includes('\n') || /^\s|\s$/u.test(text)) {
                        return null;
                    }
                    return fixer.replaceText(node, text.replace(/\\([\s\S])/g, '$1'));
                },
            });
        }
        return defineTemplateBodyVisitor(context, {
            'XElement > XMustache': verify,
            'XAttribute,XDirective > XMustache': verify,
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
                        message: `'${node.key.rawName}' should have event name.`,
                    });
                }
                const isMustacheValue = ((_a = node.value) === null || _a === void 0 ? void 0 : _a[0].type) === 'XMustache';
                if (!(isMustacheValue
                    ? isValidSingleMustache(node.value)
                    : isIdentifierExpression(node.value))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${node.key.rawName}' value should be 'literal' or 'mustache'.`,
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
const topLevelCompoents = [
    'import-sjs',
    'import',
    'filter',
];
const withSrcCompoents = [
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
        type: 'problem',
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
                        message: 'self close component shouldn\'t have children.',
                    });
                }
                if (withSrcCompoents.includes(node.name)
                    && hasAttribute(node, 'src')
                    && !isSelfClose(node)) {
                    context.report({
                        node: node,
                        loc: node.loc,
                        message: `'${node.name}' with 'src' shouldn't have children.`,
                    });
                }
                if (topLevelCompoents.includes(node.name) && !isAtTopLevel(node)) {
                    if (node.name === 'template' && hasAttribute(node, 'is')) ;
                    else {
                        context.report({
                            node: node,
                            loc: node.loc,
                            message: 'top level component shouldn\'t nested in other component.',
                        });
                    }
                }
                if ((blockComponents.includes(node.name) || inlineBlockComponents.includes(node.name))) {
                    const parent = getInlineParent(node);
                    if (parent) {
                        context.report({
                            node: node,
                            loc: node.loc,
                            message: 'component \'{{name}}\' shouldn\'t nested in component \'{{parentName}}\'.',
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
                            message: 'component \'{{name}}\' should have children.',
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
        return defineTemplateBodyVisitor(context, {
            'XDirective[key.name="elif"]'(node) {
                const element = node.parent.parent;
                const { prefix } = node.key;
                const prevElement = getPrevNode(element);
                if (!prevElement || prevElement.type !== 'XElement'
                    || (!hasDirective(element, 'if') && !hasDirective(element, 'elif'))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}elif' should follow with '${prefix}if' or '${prefix}elif'.`,
                    });
                }
                if (!isValidSingleMustacheOrExpression(node.value)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}elif' value should be expression.`,
                    });
                }
            },
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
                    || (!hasDirective(element, 'if') && hasDirective(element, 'elif'))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' should follow with '${prefix}if' or '${prefix}elif'.`,
                    });
                }
                if ((_a = node.value) === null || _a === void 0 ? void 0 : _a.length) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' should have no value.`,
                    });
                }
                if (hasDirective(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}else' and '${prefix}elif' directives can't exist on the same element.`,
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
        schema: [],
    },
    create(context) {
        const forVisitor = (node) => {
            const { key: { rawName } } = node;
            if (node.value.length > 1 || !isValidSingleMustacheOrExpression(node.value)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: `'${rawName}' value should be expression.`,
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
                    message: `'${rawName}' should has '${prefix}for'.`,
                });
            }
            else {
                const forValues = getDirective(element, 'for').value;
                if (((_a = forValues[0]) === null || _a === void 0 ? void 0 : _a.type) === 'XExpression') {
                    const forValue = forValues[0].expression;
                    if (forValue.left && node.key.name === 'for-item') {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `'${rawName}' duplicate with '${prefix}for'.`,
                        });
                    }
                    if (forValue.index && node.key.name === 'for-index') {
                        context.report({
                            node,
                            loc: node.loc,
                            message: `'${rawName}' duplicate with '${prefix}for'.`,
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
                    message: `'${rawName}' value should be literal text.`,
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
                        message: `'${prefix}' and '${prefix}else' directives can't exist on the same element.`,
                    });
                }
                if (hasDirective(element, 'elif')) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' and '${prefix}elif' directives can't exist on the same element.`,
                    });
                }
                if (!isValidSingleMustacheOrExpression(node.value)) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: `'${prefix}if' value should be expression.`,
                    });
                }
            },
        });
    },
};

var rules = {
    'array-bracket-spacing': arrayBracketSpacing,
    'arrow-spacing': arrowSpacing,
    'comment-directive': commentDirective,
    'dot-location': dotLocation,
    'dot-notation': dotNotation,
    'eqeqeq': eqeqeq,
    'func-call-spacing': funcCallSpacing,
    'html-end-tag': htmlEndTag,
    'key-spacing': keySpacing,
    'keyword-spacing': keywordSpacing,
    'mustache-interpolation-spacing': mustacheInterpolationSpacing,
    'no-confusing-for-if': noConfusingForIf,
    'no-duplicate-attributes': noDuplicateAttributes,
    'no-multi-spaces': noMultiSpaces,
    'no-parsing-error': noParsingError,
    'no-useless-concat': noUselessConcat,
    'no-useless-mustache': noUselessMustache,
    'valid-bind': validBind,
    'valid-component-nesting': validComponentNesting,
    'valid-elif': validElif,
    'valid-else': validElse,
    'valid-for': validFor,
    'valid-if': validIf,
};

const configs = {
    base,
    recommended,
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
