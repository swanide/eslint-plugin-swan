/**
 * @file index.d.ts
 * @author mengke01(kekee000@gmail.com)
 */
/* eslint-disable @typescript-eslint/init-declarations */
import type {Linter, Rule} from 'eslint';
export const rules: Record<string, Rule.RuleModule>;

export const configs: {
    base: Linter.Config<Linter.RulesRecord>;
    recommended: Linter.Config<Linter.RulesRecord>;
    strict: Linter.Config<Linter.RulesRecord>;
};

export const processors: {
    '.swan': Linter.Processor;
};

interface Globals {
    [name: string]: boolean | 'readonly' | 'readable' | 'writable' | 'writeable';
}

export const environments: {
    'globals': Record<string, Globals>;
};
