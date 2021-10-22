import ts from 'typescript';
import { join } from "path";
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
    Reflect.deleteProperty(options,'outDir')
    Reflect.set(options,'outDir',join(__dirname,'dist'))
    Reflect.set(options,'baseUrl',join(__dirname,))
    Reflect.set(options,'rootDir',join(__dirname,))
    consola.info({rootNames, options, host, oldProgram});
    return origCreateProgram(rootNames, options, host, oldProgram);
  };
  const origPostProgramCreate = host.afterProgramCreate;

  host.afterProgramCreate = (program: any) => {
    consola.info('We finished making the program!');
	if(origPostProgramCreate){
		origPostProgramCreate(program);
	}
  };

  ts.createWatchProgram(host);
}

function reportDiagnostic(diagnostic: { code: any; messageText: any; }) {
  consola.error(
    'Error',
    diagnostic.code,
    ':',
    ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())
  );
}

function reportWatchStatusChanged(diagnostic: any) {
  let message = ts.formatDiagnostic(diagnostic, formatHost);
  if (message.indexOf('TS6194') > 0) {
    message = message.replace(/message\sTS[0-9]{4}:(.+)(\s+)$/, '$1');
    consola.ready({ message, badge: true });
  }
}

watchMain();