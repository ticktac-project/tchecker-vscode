import * as vscode from 'vscode';

import { handleTckSyntax } from './tools/tckSyntax'
import { handleAutoCompletion } from './tools/autoCompletion';
import { systemSignatureHelp } from './tools/signatureHelp';
import { handleHover } from './tools/hover';

export function activate(context: vscode.ExtensionContext) {
	console.log('Extension activated.');
	let diagnosticCollection = vscode.languages.createDiagnosticCollection('tck syntax errors');

	// handle tck-syntax tool
	let tckSyntax = handleTckSyntax(diagnosticCollection);

	context.subscriptions.push(tckSyntax);
	context.subscriptions.concat(systemSignatureHelp());
	context.subscriptions.concat(handleHover());
	context.subscriptions.concat(handleAutoCompletion());
}
