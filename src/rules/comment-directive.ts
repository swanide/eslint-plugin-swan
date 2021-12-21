/**
 * @author Toru Nagashima <https://github.com/mysticatea>,
 *         mengke01(kekee000@gmail.com)
 */

/* eslint-disable no-negated-condition */

import type swan from '@baidu/swan-eslint-parser';
import type {RuleContext} from '../types/eslint';
import {getRuleUrl} from '../utils';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const COMMENT_DIRECTIVE_B = /^\s*(eslint-(?:en|dis)able)(?:\s+|$)/;
const COMMENT_DIRECTIVE_L = /^\s*(eslint-disable(?:-next)?-line)(?:\s+|$)/;

/**
 * Remove the ignored part from a given directive comment and trim it.
 * @param value The comment text to strip.
 * @returns The stripped text.
 */
function stripDirectiveComment(value: string) {
    return value.split(/\s-{2,}\s/u)[0];
}

interface RuleAndLocation{
    ruleId: string;
    index: number;
    key?: string;
}

/**
 * Parse a given comment.
 * @param pattern The RegExp pattern to parse.
 * @param comment The comment value to parse.
 * @returns The parsing result.
 */
function parse(pattern: RegExp, comment: string): {type: string, rules: RuleAndLocation[]} {
    const text = stripDirectiveComment(comment);
    const match = pattern.exec(text);
    if (match == null) {
        return null;
    }

    const type = match[1];
    const rules: RuleAndLocation[] = [];

    const rulesRe = /([^,\s]+)[,\s]*/g;
    let startIndex = match[0].length;
    rulesRe.lastIndex = startIndex;

    let res: RegExpMatchArray = null;
    while ((res = rulesRe.exec(text))) {
        const ruleId = res[1].trim();
        rules.push({
            ruleId,
            index: startIndex,
        });
        startIndex = rulesRe.lastIndex;
    }

    return {type, rules};
}

/**
 * Enable rules.
 * @param context The rule context.
 * @param loc The location information to enable.
 * @param group The group to enable.
 * @param rule The rule ID to enable.
 * @returns
 */
function enable(context: RuleContext, loc: {line: number, column: number}, group: 'block' | 'line', rule: string) {
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
            data: {rule},
        });
    }
}

/**
 * Disable rules.
 * @param context The rule context.
 * @param loc The location information to disable.
 * @param group The group to disable.
 * @param rule The rule ID to disable.
 * @param key The disable directive key.
 * @returns
 */
function disable(
    context: RuleContext, loc: {line: number, column: number}, group: 'block' | 'line', rule: string, key: string) {
    if (!rule) {
        context.report({
            loc,
            messageId: group === 'block' ? 'disableBlock' : 'disableLine',
            data: {key},
        });
    }
    else {
        context.report({
            loc,
            messageId: group === 'block' ? 'disableBlockRule' : 'disableLineRule',
            data: {rule, key},
        });
    }
}


/**
 * Gets the key of location
 * @param location The location
 * @returns
 */
function locToKey(location: swan.ast.Location) {
    return `line:${location.line},column${location.column}`;
}

/**
 * Reports unused disable directive.
 * Do not check the use of directives here. Filter the directives used with postprocess.
 * @param context The rule context.
 * @param comment The comment token to report.
 * @param kind The comment directive kind.
 * @returns The report key
 */
function reportUnused(context: RuleContext, comment: swan.ast.Token, kind: string) {
    const {loc} = comment;

    context.report({
        loc,
        messageId: 'unused',
        data: {kind},
    });

    return locToKey(loc.start);
}

/**
 * Reports unused disable directive rules.
 * Do not check the use of directives here. Filter the directives used with postprocess.
 * @param context The rule context.
 * @param comment The comment token to report.
 * @param kind The comment directive kind.
 * @param rules To report rule.
 * @returns
 */
function reportUnusedRules(
    context: RuleContext,
    comment: swan.ast.Token,
    kind: string, rules:
    RuleAndLocation[]
): Array<{ruleId: string, key: string}> {
    const sourceCode = context.getSourceCode();
    const commentStart = comment.range[0] + 4; /* <!-- */

    return rules.map(rule => {
        const start = sourceCode.getLocFromIndex(commentStart + rule.index);
        const end = sourceCode.getLocFromIndex(
            commentStart + rule.index + rule.ruleId.length
        );

        context.report({
            loc: {start, end},
            messageId: 'unusedRule',
            data: {rule: rule.ruleId, kind},
        });

        return {
            ruleId: rule.ruleId,
            key: locToKey(start),
        };
    });
}


/**
 * Process a given comment token.
 * If the comment is `eslint-disable` or `eslint-enable` then it reports the comment.
 * @param context The rule context.
 * @param comment The comment token to process.
 * @param reportUnusedDisableDirectives To report unused eslint-disable comments.
 * @returns
 */
function processBlock(context: RuleContext, comment: swan.ast.Token, reportUnusedDisableDirectives: boolean) {
    const parsed = parse(COMMENT_DIRECTIVE_B, comment.value);
    if (parsed != null) {
        if (parsed.type === 'eslint-disable') {
            if (parsed.rules.length) {
                const rules = reportUnusedDisableDirectives
                    ? reportUnusedRules(context, comment, parsed.type, parsed.rules)
                    : parsed.rules;
                for (const rule of rules) {
                    disable(
                        context,
                        comment.loc.start,
                        'block',
                        rule.ruleId,
                        rule.key || '*'
                    );
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

/**
 * Process a given comment token.
 * If the comment is `eslint-disable-line` or `eslint-disable-next-line` then it reports the comment.
 * @param context The rule context.
 * @param comment The comment token to process.
 * @param reportUnusedDisableDirectives To report unused eslint-disable comments.
 * @returns
 */
function processLine(context: RuleContext, comment: swan.ast.Token, reportUnusedDisableDirectives: boolean) {
    const parsed = parse(COMMENT_DIRECTIVE_L, comment.value);
    if (parsed != null && comment.loc.start.line === comment.loc.end.line) {
        const line = +comment.loc.start.line + (parsed.type === 'eslint-disable-line' ? 0 : 1);
        const column = -1;
        if (parsed.rules.length) {
            const rules = reportUnusedDisableDirectives
                ? reportUnusedRules(context, comment, parsed.type, parsed.rules)
                : parsed.rules;
            for (const rule of rules) {
                disable(context, {line, column}, 'line', rule.ruleId, rule.key || '');
                enable(context, {line: line + 1, column}, 'line', rule.ruleId);
            }
        }
        else {
            const key = reportUnusedDisableDirectives
                ? reportUnused(context, comment, parsed.type)
                : '';
            disable(context, {line, column}, 'line', null, key);
            enable(context, {line: line + 1, column}, 'line', null);
        }
    }
}




/**
 * Extracts the top-level elements in document fragment.
 * @param documentFragment The document fragment.
 * @returns The top-level elements
 */
function extractTopLevelHTMLElements(documentFragment: swan.ast.XDocument) {
    return documentFragment.children.filter(node => node.type === 'XElement');
}

/**
 * Extracts the top-level comments in document fragment.
 * @param documentFragment The document fragment.
 * @returns The top-level comments
 */
function extractTopLevelDocumentFragmentComments(documentFragment: swan.ast.XDocument) {
    const elements = extractTopLevelHTMLElements(documentFragment);

    return documentFragment.comments.filter(comment =>
        elements.every(
            element =>
                comment.range[1] <= element.range[0]
        || element.range[1] <= comment.range[0]
        ));
}

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

export default {
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

    create(context: RuleContext) {
        const options = context.options[0] || {};

        const {reportUnusedDisableDirectives} = options;
        const documentFragment = context.parserServices.getDocumentFragment
            && context.parserServices.getDocumentFragment();

        return {
            Program(node: swan.ast.ScriptProgram) {
                if (node.templateBody) {
                    // Send directives to the post-process.
                    for (const comment of node.templateBody.comments) {
                        processBlock(context, comment, reportUnusedDisableDirectives);
                        processLine(context, comment, reportUnusedDisableDirectives);
                    }

                    // Send a clear mark to the post-process.
                    context.report({
                        loc: node.templateBody.loc.end,
                        messageId: 'clear',
                    });
                }
                if (documentFragment) {
                    // Send directives to the post-process.
                    for (const comment of extractTopLevelDocumentFragmentComments(documentFragment)) {
                        processBlock(context, comment, reportUnusedDisableDirectives);
                        processLine(context, comment, reportUnusedDisableDirectives);
                    }

                    // Send a clear mark to the post-process.
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
