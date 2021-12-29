/**
 * @file utils
 * @author mengke(kekee000@gmail.com)
 */
import type eslint from 'eslint';
import type swan from '@baidu/swan-eslint-parser';
import {RuleContext} from '../types/eslint';

/* eslint-disable @typescript-eslint/no-var-requires,  @typescript-eslint/no-require-imports */

const emptyTextReg = /^\s*$/;
/**
 * is swan file
 * @param filename file name
 * @returns
 */
export const isSwanFile = (filename: string) => filename.endsWith('.swan');

/**
 * get rule url
 * @param name rule name
 */
export const getRuleUrl = (name: string) => `${
    process.env.SWAN_LINT_RULE_URL || 'https://smartprogram.baidu.com/docs/develop/lint'
}/rules/${name}.md`;


let ruleMap: Map<string, eslint.Rule.RuleModule> = null;

function getCoreRule(name: string) {
    // 支持外部 eslint 传入
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

interface TemplateListener {
    [key: string]: (...args: any) => void;
}

/**
 * Wrap the rule context object to override methods which access to tokens (such as getTokenAfter).
 * @param context The rule context object.
 * @param tokenStore The token store object for template.
 * @returns
 */
function wrapContextToOverrideTokenMethods(context: RuleContext, tokenStore): RuleContext {
    const eslintSourceCode = context.getSourceCode();

    /** @type {Token[] | null} */
    let tokensAndComments = null;
    function getTokensAndComments() {
        if (tokensAndComments) {
            return tokensAndComments;
        }
        const {templateBody} = eslintSourceCode.ast as swan.ast.ScriptProgram;

        tokensAndComments = templateBody
            ? tokenStore.getTokens(templateBody, {
                includeComments: true,
            })
            : [];
        return tokensAndComments;
    }
    const sourceCode = new Proxy(({...eslintSourceCode}), {
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
export function defineTemplateBodyVisitor(
    context: RuleContext,
    templateBodyVisitor: TemplateListener,
    scriptVisitor?: eslint.Rule.RuleListener
): eslint.Rule.RuleListener {
    if (context.parserServices.defineTemplateBodyVisitor == null) {
        if (isSwanFile(context.getFilename())) {
            context.report({
                loc: {line: 1, column: 0},
                message: 'Use the latest @baidu/swan-eslint-parser.',
            });
        }
        return {};
    }

    return context.parserServices.defineTemplateBodyVisitor(
        templateBodyVisitor,
        scriptVisitor
    ) as eslint.Rule.RuleListener;
}

/**
 * get previous node, ignore empty text node
 * @param node node.
 * @returns `true` if the start tag has the directive.
 */
export function getPrevNode(node: swan.ast.XElement | swan.ast.XText | swan.ast.XExpression) {
    const {children} = node.parent as {children: swan.ast.XNode[]};
    if (!children || !children.length) {
        return null;
    }
    let index = children.indexOf(node);
    if (index <= 0) {
        return null;
    }
    let prevNode: swan.ast.XNode = null;
    while ((prevNode = children[--index])) {
        if (prevNode.type !== 'XText'
            || prevNode.type === 'XText' && !emptyTextReg.test(prevNode.value)) {
            break;
        }
    }
    return prevNode;
}

/**
 * get next node, ignore empty text node
 * @param node node.
 * @returns `true` if the start tag has the directive.
 */
export function getNextNode(node: swan.ast.XNode) {
    const {children} = node.parent as {children: swan.ast.XNode[]};
    if (!children || !children.length) {
        return null;
    }
    let index = children.findIndex(n => n === node);
    if (index === -1 || index === children.length - 1) {
        return null;
    }

    let nextNode: swan.ast.XNode = null;
    while ((nextNode = children[++index])) {
        if (nextNode.type !== 'XText'
            || nextNode.type === 'XText' && !emptyTextReg.test(nextNode.value)) {
            break;
        }
    }
    return nextNode;
}

/**
 * Get the directive which has the given name.
 *
 * @param node The start tag node to check.
 * @param name The directive name to check.
 * @returns The found directive.
 */
export function getAttribute(node: swan.ast.XElement, name: string) {
    return (
        node.startTag.attributes.find(
            node => (
                node.type === 'XDirective' && node.key.name === name
            )
        ) || null
    );
}


/**
 * Check whether the given start tag has specific attribute.
 * @param node The start tag node to check.
 * @param name The directive name to check.
 * @returns `true` if the start tag has the directive.
 */
export function hasAttribute(node: swan.ast.XElement, name: string) {
    return Boolean(getAttribute(node, name));
}


/**
 * Get the directive which has the given name.
 *
 * @param node The start tag node to check.
 * @param name The directive name to check.
 * @returns The found directive.
 */
export function getDirective(node: swan.ast.XElement, name: string) {
    return (
        node.startTag.attributes.find(
            node => (
                node.type === 'XDirective' && node.key.name === name
            )
        ) || null
    );
}

/**
 * Check whether the given start tag has specific directive.
 * @param node The start tag node to check.
 * @param name The directive name to check.
 * @returns `true` if the start tag has the directive.
 */
export function hasDirective(node: swan.ast.XElement, name: string) {
    return Boolean(getDirective(node, name));
}

/**
 * Check whether the given directive attribute has only one mustache expression
 * @param values The directive attribute values to check.
 * @returns
 */
export function isValidSingleMustacheOrExpression(values: swan.ast.XAttributeValue) {
    if (values?.length !== 1) {
        return false;
    }
    const [value] = values;

    if (value.type === 'XExpression' && value.expression != null) {
        return true;
    }

    if (value.type === 'XMustache' && value.value?.expression != null) {
        return true;
    }
    return false;
}

/**
 * Check whether the given directive attribute has only one mustache expression or expression
 * @param values The directive attribute values to check.
 * @returns
 */
export function isValidSingleMustache(values: swan.ast.XAttributeValue) {
    if (values?.length !== 1) {
        return false;
    }
    const [value] = values;

    if (value.type === 'XMustache' && value.value?.expression != null) {
        return true;
    }
    return false;
}

/**
 * Check whether the given directive attribute is expression (="{{expr}}")
 * @param values The directive attribute node to check.
 * @returns
 */
export function isEmptyDirectiveValue(values: swan.ast.XAttributeValue) {
    if (!values?.length) {
        return true;
    }
    const [value] = values;

    if (value.type === 'XExpression' && value.expression == null) {
        return true;
    }

    if (value.type === 'XMustache' && value.value?.expression == null) {
        return true;
    }
    return false;
}


/**
 * Check whether the given expression is identifier
 * @param values The directive attribute value to check.
 * @returns
 */
export function isIdentifierExpression(values: swan.ast.XAttributeValue) {
    if (values?.length !== 1) {
        return false;
    }
    const [value] = values;
    return value.type === 'XExpression' && value.expression?.type === 'Identifier';
}

/**
 * Check attribute value type
 * @param node The directive attribute node to check.
 * @returns
 */
export function getValueType(node: swan.ast.XAttribute | swan.ast.XDirective) {
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

/**
* Check whether the component is declared in a single line or not.
* @param node
* @returns
*/
export function isSingleLine(node: swan.ast.XNode) {
    return node.loc.start.line === node.loc.end.line;
}

/**
* Checks whether or not the tokens of two given nodes are same.
* @param left A node 1 to compare.
* @param right A node 2 to compare.
* @param sourceCode The ESLint source code object.
* @returns the source code for the given node.
*/
export function equalTokens(left: swan.ast.XNode, right: swan.ast.XNode, sourceCode: swan.ParserServices.TokenStore) {
    const tokensL = sourceCode.getTokens(left);
    const tokensR = sourceCode.getTokens(right);

    if (tokensL.length !== tokensR.length) {
        return false;
    }
    for (let i = 0; i < tokensL.length; ++i) {
        if (
            tokensL[i].type !== tokensR[i].type
    || tokensL[i].value !== tokensR[i].value
        ) {
            return false;
        }
    }

    return true;
}

/**
 * Get the previous sibling element of the given element.
 * @param node The element node to get the previous sibling element.
 * @returns The previous sibling element.
 */
export function prevSibling(node: swan.ast.XElement) {
    let prevElement: swan.ast.XElement = null;

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

/**
 * Wrap a given core rule to apply it to Vue.js template.
 * @param coreRuleName The name of the core rule implementation to wrap.
 * @returns The wrapped rule implementation.
 */
export function wrapCoreRule(coreRuleName: string) {
    const coreRule = getCoreRule(coreRuleName);
    return {
        create(context: eslint.Rule.RuleContext) {
            const tokenStore = context.parserServices.getTemplateBodyTokenStore
            && context.parserServices.getTemplateBodyTokenStore();

            // The `context.getSourceCode()` cannot access the tokens of templates.
            // So override the methods which access to tokens by the `tokenStore`.
            if (tokenStore) {
                context = wrapContextToOverrideTokenMethods(context, tokenStore);
            }

            // Move `Program` handlers to `XElement[parent.type!='XElement']`
            const coreHandlers = coreRule.create(context);

            const handlers = {...coreHandlers};
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

            // Apply the handlers to templates.
            return context.parserServices.defineTemplateBodyVisitor(handlers);
        },
        meta: {
            ...coreRule.meta, docs: {
                ...coreRule.meta.docs,
                category: '',
                categories: ['essential'],
                url: getRuleUrl(coreRuleName),
                extensionRule: true,
                coreRuleUrl: coreRule.meta.docs.url,
            },
        },
    };
}
