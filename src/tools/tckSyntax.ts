import * as vscode from 'vscode';
import { SpawnSyncReturns } from 'child_process';

import { handleTckTool, displayStatusBar } from './tckCommon';
import { parseErrorPosition } from './parseDocument';
import { tckSyntaxStatusBarText } from '../constants';

// gets tck-syntax tool from config
const tckCommand : string | undefined = (vscode.workspace.getConfiguration('tchecker-vscode').get('tck-syntax'));

export function handleTckSyntax(diagnosticCollection: vscode.DiagnosticCollection) {
	return [handleTckTool('tchecker-vscode.tckSyntax', tckCommand as string, diagnosticCollection, handleTckSyntaxWarnings),
	displayStatusBar('tchecker-vscode.tckSyntax', tckSyntaxStatusBarText, 40)];
}

function handleTckSyntaxWarnings(output: SpawnSyncReturns<string>, diagnosticCollection: vscode.DiagnosticCollection, currentFile: string) {
	if (output.status === 0) {
		if (output.stderr !== '') {
			vscode.window.showInformationMessage('Syntax OK. Warning(s) detected, please check the \'Problems\' panel for more details.');

			// getting warnings
			const warnings = parseErrorPosition(output, 1);

			// sending warnings to VSCode
			diagnosticCollection.set(vscode.Uri.parse(currentFile), warnings);
		} else {
			vscode.window.showInformationMessage('Syntax OK.');
		}
	}
}
