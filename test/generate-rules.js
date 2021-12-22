/**
 * @file generate-rules.ts
 * @author mengke01(kekee000@gmail.com)
 */
const {readdirSync, writeFileSync} = require('fs');

function main(baseDir) {
    const files = readdirSync(baseDir);
    const importBuffer = [];
    const exportBuffer = ['export default {'];
    for (const file of files) {
        if (file.endsWith('.js') || file.endsWith('.ts')) {
            const moduleName = file.replace(/\.\w+$/, '');
            const moduleRef = moduleName.replace(/-(\w)/g, (_, w) => w.toUpperCase());
            importBuffer.push(`import ${moduleRef} from './rules/${moduleName}';`);
            exportBuffer.push(`    '${moduleName}': ${moduleRef},`);
        }
    }
    exportBuffer.push('};');

    const code = `/**
 * @file this is generated code, use 'node test/generate-rules' to generate rules.ts.
 */
${importBuffer.join('\n')}
${exportBuffer.join('\n')}
`;
    writeFileSync(`${__dirname}/../src/rules.ts`, code);
    console.log('done');
}

main(`${__dirname}/../src/rules`);
