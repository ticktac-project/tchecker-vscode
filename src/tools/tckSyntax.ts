import * as vscode from 'vscode';
import { SpawnSyncReturns, spawnSync } from 'child_process';

import { handleTckTool } from './tckCommon';
import { parseErrorPosition } from './parseDocument';

// gets tck-syntax tool from config
const tckCommand : string | undefined = (vscode.workspace.getConfiguration('tchecker-vscode').get('tck-syntax'));

export function handleTckSyntax(diagnosticCollection: vscode.DiagnosticCollection) {
	return handleTckTool('tchecker-vscode.tckSyntax', tckCommand as string, diagnosticCollection, handleTckSyntaxWarnings);
}

// todo: to do: replace by actual position
function handleTckSyntaxWarnings(output: SpawnSyncReturns<string>, diagnosticCollection: vscode.DiagnosticCollection, currentFile: string) {
	if (output.stderr !== '') {
		vscode.window.showInformationMessage('Syntax OK. Warning(s) detected, please check the \'Problems\' panel for more details.');
		const warnings = parseErrorPosition(output);
		diagnosticCollection.set(vscode.Uri.parse(currentFile), warnings);
	} else {
		vscode.window.showInformationMessage('Syntax OK.');
	}
}
