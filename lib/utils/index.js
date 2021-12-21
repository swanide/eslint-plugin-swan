"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapCoreRule = exports.prevSibling = exports.equalTokens = exports.isSingleLine = exports.getValueType = exports.isIdentifierExpression = exports.isEmptyDirectiveValue = exports.isValidSingleMustache = exports.isValidSingleMustacheOrExpression = exports.hasDirective = exports.getDirective = exports.hasAttribute = exports.getAttribute = exports.getNextNode = exports.getPrevNode = exports.defineTemplateBodyVisitor = exports.getRuleUrl = exports.isSwanFile = void 0;
/* eslint-disable @typescript-eslint/no-var-requires,  @typescript-eslint/no-require-imports */
const emptyTextReg = /^\s*$/;
/**
 * is swan file
 * @param filename file name
 * @returns
 */
const isSwanFile = (filename) => filename.endsWith('.swan');
exports.isSwanFile = isSwanFile;
/**
 * get rule url
 * @param name rule name
 */
const getRuleUrl = (name) => `https://smartprogram.baidu.com/docs/develop/rules/${name}.md`;
exports.getRuleUrl = getRuleUrl;
let ruleMap = null;
function getCoreRule(name) {
    const map = ruleMap
        || (ruleMap = new (require('eslint').Linter)()
            .getRules());
    return map.get(name) || require(`eslint/lib/rules/${name}`);
}
/**
 * Wrap the rule context object to override methods which access to tokens (such as getTokenAfter).
 * @param context The rule context object.
 * @param tokenStore The token store object for template.
 * @returns
 */
function wrapContextToOverrideTokenMethods(context, tokenStore) {
    const eslintSourceCode = context.getSourceCode();
    /** @type {Token[] | null} */
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
        // @ts-expect-error
        getSourceCode() {
            return sourceCode;
        },
    };
}
/**
 * Register the given visitor to parser services.
 * If the parser service of `vue-eslint-parser` was not found,
 * this generates a warning.
 *
 * @param context The rule context to use parser services.
 * @param templateBodyVisitor The visitor to traverse the template body.
 * @param scriptVisitor The visitor to traverse the script.
 * @returns The merged visitor.
 */
function defineTemplateBodyVisitor(context, templateBodyVisitor, scriptVisitor) {
    if (context.parserServices.defineTemplateBodyVisitor == null) {
        if ((0, exports.isSwanFile)(context.getFilename())) {
            context.report({
                loc: { line: 1, column: 0 },
                message: 'Use the latest @baidu/swan-eslint-parser.',
            });
        }
        return {};
    }
    return context.parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
}
exports.defineTemplateBodyVisitor = defineTemplateBodyVisitor;
/**
 * get previous node, ignore empty text node
 * @param node node.
 * @returns `true` if the start tag has the directive.
 */
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
exports.getPrevNode = getPrevNode;
/**
 * get next node, ignore empty text node
 * @param node node.
 * @returns `true` if the start tag has the directive.
 */
function getNextNode(node) {
    const { children } = node.parent;
    if (!children || !children.length) {
        return null;
    }
    let index = children.findIndex(n => n === node);
    if (index === -1 || index === children.length - 1) {
        return null;
    }
    let nextNode = null;
    while ((nextNode = children[++index])) {
        if (nextNode.type !== 'XText'
            || nextNode.type === 'XText' && !emptyTextReg.test(nextNode.value)) {
            break;
        }
    }
    return nextNode;
}
exports.getNextNode = getNextNode;
/**
 * Get the directive which has the given name.
 *
 * @param node The start tag node to check.
 * @param name The directive name to check.
 * @returns The found directive.
 */
function getAttribute(node, name) {
    return (node.startTag.attributes.find(node => (node.type === 'XDirective' && node.key.name === name)) || null);
}
exports.getAttribute = getAttribute;
/**
 * Check whether the given start tag has specific attribute.
 * @param node The start tag node to check.
 * @param name The directive name to check.
 * @returns `true` if the start tag has the directive.
 */
function hasAttribute(node, name) {
    return Boolean(getAttribute(node, name));
}
exports.hasAttribute = hasAttribute;
/**
 * Get the directive which has the given name.
 *
 * @param node The start tag node to check.
 * @param name The directive name to check.
 * @returns The found directive.
 */
function getDirective(node, name) {
    return (node.startTag.attributes.find(node => (node.type === 'XDirective' && node.key.name === name)) || null);
}
exports.getDirective = getDirective;
/**
 * Check whether the given start tag has specific directive.
 * @param node The start tag node to check.
 * @param name The directive name to check.
 * @returns `true` if the start tag has the directive.
 */
function hasDirective(node, name) {
    return Boolean(getDirective(node, name));
}
exports.hasDirective = hasDirective;
/**
 * Check whether the given directive attribute has only one mustache expression
 * @param values The directive attribute values to check.
 * @returns
 */
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
exports.isValidSingleMustacheOrExpression = isValidSingleMustacheOrExpression;
/**
 * Check whether the given directive attribute has only one mustache expression or expression
 * @param values The directive attribute values to check.
 * @returns
 */
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
exports.isValidSingleMustache = isValidSingleMustache;
/**
 * Check whether the given directive attribute is expression (="{{expr}}")
 * @param values The directive attribute node to check.
 * @returns
 */
function isEmptyDirectiveValue(values) {
    var _a;
    if (!(values === null || values === void 0 ? void 0 : values.length)) {
        return true;
    }
    const [value] = values;
    if (value.type === 'XExpression' && value.expression == null) {
        return true;
    }
    if (value.type === 'XMustache' && ((_a = value.value) === null || _a === void 0 ? void 0 : _a.expression) == null) {
        return true;
    }
    return false;
}
exports.isEmptyDirectiveValue = isEmptyDirectiveValue;
/**
 * Check whether the given expression is identifier
 * @param values The directive attribute value to check.
 * @returns
 */
function isIdentifierExpression(values) {
    var _a;
    if ((values === null || values === void 0 ? void 0 : values.length) !== 1) {
        return false;
    }
    const [value] = values;
    return value.type === 'XExpression' && ((_a = value.expression) === null || _a === void 0 ? void 0 : _a.type) === 'Identifier';
}
exports.isIdentifierExpression = isIdentifierExpression;
/**
 * Check attribute value type
 * @param node The directive attribute node to check.
 * @returns
 */
function getValueType(node) {
    if (node.value == null || !node.value.length) {
        return 'none';
    }
    if (node.value.every(v => v.type === 'XLiteral')) {
        return 'literal';
    }
    // s-if="{{abc}}"
    if (node.value.every(v => v.type === 'XMustache')) {
        return 'mustache';
    }
    // s-if="abc"
    if (node.value.every(v => v.type === 'XExpression')) {
        return 'expression';
    }
    return 'mixed';
}
exports.getValueType = getValueType;
/**
* Check whether the component is declared in a single line or not.
* @param node
* @returns
*/
function isSingleLine(node) {
    return node.loc.start.line === node.loc.end.line;
}
exports.isSingleLine = isSingleLine;
/**
* Checks whether or not the tokens of two given nodes are same.
* @param left A node 1 to compare.
* @param right A node 2 to compare.
* @param sourceCode The ESLint source code object.
* @returns the source code for the given node.
*/
function equalTokens(left, right, sourceCode) {
    const tokensL = sourceCode.getTokens(left);
    const tokensR = sourceCode.getTokens(right);
    if (tokensL.length !== tokensR.length) {
        return false;
    }
    for (let i = 0; i < tokensL.length; ++i) {
        if (tokensL[i].type !== tokensR[i].type
            || tokensL[i].value !== tokensR[i].value) {
            return false;
        }
    }
    return true;
}
exports.equalTokens = equalTokens;
/**
 * Get the previous sibling element of the given element.
 * @param node The element node to get the previous sibling element.
 * @returns The previous sibling element.
 */
function prevSibling(node) {
    let prevElement = null;
    for (const siblingNode of (node.parent && node.parent.children) || []) {
        if (siblingNode === node) {
            return prevElement;
        }
        if (siblingNode.type === 'XElement') {
            prevElement = siblingNode;
        }
    }
    return null;
}
exports.prevSibling = prevSibling;
/**
 * Wrap a given core rule to apply it to Vue.js template.
 * @param coreRuleName The name of the core rule implementation to wrap.
 * @returns The wrapped rule implementation.
 */
function wrapCoreRule(coreRuleName) {
    const coreRule = getCoreRule(coreRuleName);
    return {
        create(context) {
            const tokenStore = context.parserServices.getTemplateBodyTokenStore
                && context.parserServices.getTemplateBodyTokenStore();
            // The `context.getSourceCode()` cannot access the tokens of templates.
            // So override the methods which access to tokens by the `tokenStore`.
            if (tokenStore) {
                context = wrapContextToOverrideTokenMethods(context, tokenStore);
            }
            // Move `Program` handlers to `XElement[parent.type!='XElement']`
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
            // Apply the handlers to templates.
            return context.parserServices.defineTemplateBodyVisitor(handlers);
        },
        meta: Object.assign(Object.assign({}, coreRule.meta), { docs: Object.assign(Object.assign({}, coreRule.meta.docs), { category: '', categories: ['essential'], url: (0, exports.getRuleUrl)(coreRuleName), extensionRule: true, coreRuleUrl: coreRule.meta.docs.url }) }),
    };
}
exports.wrapCoreRule = wrapCoreRule;
