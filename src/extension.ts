/**
 * This module initializes the extension.
 */

import * as vscode from 'vscode';

import { handleTckSyntax, tckSyntaxStatusBar as tckSyntaxStatusBarItem } from './tools/tckSyntax'
import { handleTckReachLiveness, tckReachLivenessStatusBar as tckReachLivenessStatusBarItem } from './tools/tckReachLiveness';
import { handleTckSimulate, tckSimulateStatusBar as tckSimulateStatusBarItem } from './tools/tckSimulate';
import { handleAutoCompletion } from './tools/autoCompletion';
import { systemSignatureHelp } from './tools/signatureHelp';
import { handleHover } from './tools/hover';
import { hideTckStatusBarItem, showTckStatusBarItem } from './tools/tckCommon';

export let currentEditor : vscode.TextEditor = vscode.window.activeTextEditor as vscode.TextEditor;

// watch editor changes
vscode.window.onDidChangeActiveTextEditor((editor: vscode.TextEditor | undefined) => {
	if (editor && editor.document.uri.scheme === 'file') {
		currentEditor = editor;
		if (editor.document.uri.fsPath.endsWith('.tck')) { // in a tck document: we want status bar items
			showTckStatusBarItem([ tckSyntaxStatusBarItem, tckSimulateStatusBarItem, tckReachLivenessStatusBarItem ]);
		} else { // not a tck document: we don't want status bar items
			hideTckStatusBarItem([ tckSyntaxStatusBarItem, tckSimulateStatusBarItem, tckReachLivenessStatusBarItem ]);
		}
	}
});


/**
 * Activates the extension.
 * 
 * @param context VSC context
 */
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

export function deactivate(context: vscode.ExtensionContext) {
	console.log('Deactivation...');
	console.log(context.subscriptions);
	return undefined;
}
