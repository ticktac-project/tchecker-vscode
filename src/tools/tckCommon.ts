import * as vscode from 'vscode';
import { SpawnSyncReturns, spawnSync } from 'child_process';

import { tckPath } from '../constants';
import { parseErrorPosition } from './parseDocument';

let currentEditor : vscode.TextEditor = vscode.window.activeTextEditor as vscode.TextEditor;
vscode.window.onDidChangeActiveTextEditor((editor: vscode.TextEditor | undefined) => {
	if (editor && editor.document.uri.scheme === 'file') {
		currentEditor = editor;
	}
});

export function handleTckTool(id: string, command: string, diagnosticCollection: vscode.DiagnosticCollection, tool: (output: SpawnSyncReturns<string>, diagnostic: vscode.DiagnosticCollection, file: string) => void) {
	return vscode.commands.registerCommand(id, () => {
		const currentFile = currentEditor.document.uri.fsPath;
		console.log(currentFile);
		if (currentFile === '') {
			return;
		}

		diagnosticCollection.clear();

		const output: SpawnSyncReturns<string> = spawnSync(tckPath + command + ' ' + currentFile, { shell: true, encoding: 'utf-8' });

		// handling errors
		if (output.status !== 0) {
			handleErrorsOutput(output, diagnosticCollection, currentFile);
		}

		tool(output, diagnosticCollection, currentFile);
	});
}

function handleErrorsOutput(output: SpawnSyncReturns<string>, diagnosticCollection: vscode.DiagnosticCollection, currentFile: string) {

	if (output.status !== 0) {
		vscode.window.showErrorMessage('An error has occurred. Please check the \'Problems\' panel for more details.');
		
		// getting errors
		const errors = parseErrorPosition(output, 0);

		// sending errors to VSCode
		diagnosticCollection.set(vscode.Uri.parse(currentFile), errors);
	}
}

export function displayStatusBar(tckCommand: string, name: string, priority: number) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, priority);
	statusBarItem.command = tckCommand;
	statusBarItem.text = name;
	statusBarItem.show();
	return statusBarItem;
}
