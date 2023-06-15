import * as vscode from 'vscode';
import { handleTckSyntax } from './tools/tckSyntax'

export function activate(context: vscode.ExtensionContext) {
	console.log('Extension activated.');

	// handle tck-syntax tool
	let tckSyntax = handleTckSyntax;

	context.subscriptions.push(tckSyntax);
}
