import * as vscode from 'vscode';
import { handleTckSyntax } from './tools/tckSyntax'

export function activate(context: vscode.ExtensionContext) {
	console.log('Extension activated.');

	let diagnosticCollection = vscode.languages.createDiagnosticCollection('tck syntax errors');

	// handle tck-syntax tool
	let tckSyntax = handleTckSyntax(diagnosticCollection);

	context.subscriptions.push(tckSyntax);
}
