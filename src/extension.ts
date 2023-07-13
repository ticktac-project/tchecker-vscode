import * as vscode from 'vscode';

import { handleTckSyntax } from './tools/tckSyntax'
import { handleTckReachLiveness } from './tools/tckReachLiveness';
import { handleTckSimulate } from './tools/tckSimulate';
import { handleAutoCompletion } from './tools/autoCompletion';
import { systemSignatureHelp } from './tools/signatureHelp';
import { handleHover } from './tools/hover';

export function activate(context: vscode.ExtensionContext) {
	console.log('Extension activated.');
	const diagnosticCollection = vscode.languages.createDiagnosticCollection('errors');

	const tckSyntax = handleTckSyntax(diagnosticCollection);
	const tckReach = handleTckReachLiveness();
	const tckSimulate = handleTckSimulate(diagnosticCollection);

	context.subscriptions.concat(tckSyntax);
	context.subscriptions.concat(tckReach);
	context.subscriptions.concat(tckSimulate);
	context.subscriptions.concat(systemSignatureHelp());
	context.subscriptions.concat(handleHover());
	context.subscriptions.concat(handleAutoCompletion());
}
