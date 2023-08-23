/**
 * @file eslint.d.ts
 * @author mengke01(kekee000@gmail.com)
 */
import * as eslint from 'eslint';
import type swan from '@swanide/swan-eslint-parser';


type ReportDescriptor = eslint.Rule.ReportDescriptor | {
    node: swan.ast.XNode | swan.ast.Token;
};

type SourceCode = eslint.SourceCode;
interface RuleContext extends eslint.Rule.RuleContext {
    parserServices: swan.ParserServices;
    report(descriptor: ReportDescriptor): void;

    getSourceCode(): SourceCode;
}

type RuleFixer = eslint.Rule.RuleFixer;