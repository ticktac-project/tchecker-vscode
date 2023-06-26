import * as vscode from 'vscode';
import { SpawnSyncReturns, spawnSync } from 'child_process';

import { tckPath } from '../constants';

export function handleTckTool(id: string, command: string, diagnosticCollection: vscode.DiagnosticCollection, tool: any) {
	return vscode.commands.registerCommand(id, () => {
		let currentFile = vscode.window.activeTextEditor?.document.fileName;
		if (currentFile === undefined) {
			currentFile = "";
		}

		diagnosticCollection.clear();

		const output: SpawnSyncReturns<string> = spawnSync(tckPath + command + " " + currentFile, { shell: true, encoding: 'utf-8' });

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
		const stderr = output.stderr.split('\n');
		let i = 0;
		// todo: reparse errors
		const errors = [];
		while (i < stderr.length - 1) {
			const [line, col] = stderr[i].split(' ')[1].split('.');
			const pos = new vscode.Position(parseInt(line)-1, parseInt(col)-1);
			const range = new vscode.Range(pos, pos);
			errors.push(new vscode.Diagnostic(range, stderr[i]));
			i++;
		}
		diagnosticCollection.set(vscode.Uri.parse(currentFile), errors);
	}
}
