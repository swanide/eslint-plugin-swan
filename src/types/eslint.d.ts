/**
 * @file eslint.d.ts
 * @author mengke01(kekee000@gmail.com)
 */
import * as eslint from 'eslint';
import swan from '@baidu/swan-eslint-parser';

type ReportDescriptor = eslint.Rule.ReportDescriptor | {
    node: swan.ast.XNode;
};

type SourceCode = eslint.SourceCode;

interface RuleContext extends eslint.Rule.RuleContext {
    parserServices: swan.ParserServices;
    report(descriptor: ReportDescriptor): void;

    getSourceCode(): SourceCode;
}