import * as vscode from 'vscode';
import { SpawnSyncReturns, spawnSync } from 'child_process';


// gets the TChecker build path from config
let tcheckerPath : string | undefined = vscode.workspace.getConfiguration('tchecker-vscode').get('path');

// gets the TChecker command associated with syntax checking
let tcheckerCommand : string | undefined = (vscode.workspace.getConfiguration('tchecker-vscode').get('tck-syntax'));

export function handleTckSyntax(diagnosticCollection: vscode.DiagnosticCollection) {
	return vscode.commands.registerCommand('tchecker-vscode.tckSyntax', () => {
		
		let currentFile = vscode.window.activeTextEditor?.document.fileName;
		if (currentFile === undefined) {
			currentFile = "";
		}

		diagnosticCollection.clear();
		
		let output: SpawnSyncReturns<string> = spawnSync(tcheckerPath as string + tcheckerCommand as string + " " + currentFile, { shell: true, encoding: 'utf-8' });

		handleTckSyntaxOutput(output, diagnosticCollection, currentFile);
	});
}

function handleTckSyntaxOutput(output: SpawnSyncReturns<string>, diagnosticCollection: vscode.DiagnosticCollection, currentFile: string) {

	if (output.status !== 0) { // error
		vscode.window.showErrorMessage('An error has occurred. Please check the \'Problems\' panel for more details.');
		// getting errors
		const stderr = output.stderr.split('\n');
		let i = 0;
		let errors = [];
		while (i < stderr.length - 1) {
			let [line, col] = stderr[i].split(' ')[1].split('.');
			const pos = new vscode.Position(parseInt(line)-1, parseInt(col)-1);
			const range = new vscode.Range(pos, pos);
			errors.push(new vscode.Diagnostic(range, stderr[i]));
			i++;
		}
		diagnosticCollection.set(vscode.Uri.parse(currentFile), errors);
	} else {
		vscode.window.showInformationMessage('Syntax OK.');

		if (output.stderr !== '') { // warning
			const warningOutput = output.stderr.split('\n');
			let i = 0;
			let warnings = [];
			const pos = new vscode.Position(0,0); // to do: replace by actual position (waiting for a tck-syntax feature)
			while (i < warningOutput.length - 1) {
				const range = new vscode.Range(pos, pos);
				warnings.push(new vscode.Diagnostic(range, warningOutput[i], 1));
				i++;
			}
			diagnosticCollection.set(vscode.Uri.parse(currentFile), warnings);
		}
	}
}
