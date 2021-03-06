// ts api
import ts, { Diagnostic } from 'typescript';
import { join } from 'path';
import consola from 'consola';
const formatHost = {
    getCanonicalFileName: (path: any) => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
};

function watchMain() {
    const configPath = ts.findConfigFile(/*searchPath*/ './', ts.sys.fileExists, 'tsconfig.json');
    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

    const host = ts.createWatchCompilerHost(
        configPath,
        {},
        ts.sys,
        createProgram,
        reportDiagnostic,
        reportWatchStatusChanged
    );

    const origCreateProgram = host.createProgram;
    host.createProgram = (rootNames: any, options: any, host: any, oldProgram: any) => {
        consola.info("We're about to create the program!");
        Reflect.deleteProperty(options, 'outDir');
        Reflect.set(options, 'outDir', join(process.cwd(), 'dist'));
        Reflect.set(options, 'baseUrl', join(process.cwd()));
        Reflect.set(options, 'rootDir', join(process.cwd()));
        consola.info({ rootNames, options, host, oldProgram });
        return origCreateProgram(rootNames, options, host, oldProgram);
    };
    const origPostProgramCreate = host.afterProgramCreate;

    host.afterProgramCreate = (program: any) => {
        consola.info('We finished making the program!');
        if (origPostProgramCreate) {
            origPostProgramCreate(program);
        }
    };

    ts.createWatchProgram(host);
}

function reportDiagnostic(diagnostic: Diagnostic) {
    // console.log({diagnostic})
    consola.error(
        'Path',
        ':',
        diagnostic?.file?.fileName,
        `
       `,
        'Error',
        diagnostic.code,
        ':',
        ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())
    );
}

function reportWatchStatusChanged(diagnostic: Diagnostic) {
    let message = ts.formatDiagnostic(diagnostic, formatHost);
    if (message.indexOf('TS6194') > 0) {
        // console.log({message})
        message = message.replace(/message\sTS[0-9]{4}:(.+)(\s+)$/, '$1');
        consola.ready({ message: message.replace('Watching for file changes', ''), badge: true });
        process.exit();
    }
}

watchMain();
