/**
 * This module integrates the 'tck-syntax' tool in the extension.
 * 
 * handleTckSyntax registers a VSC command that allows the user to run a syntax
 * check. Depending on the output, it calls a function that alert the user
 * 
 * This module relies on:
 *   - tckCommon.ts in order to create the status bar;
 *   - parseDocument.ts in order to get the position of potential syntax errors;
 *   - extention.ts in order to get the current editor;
 *   - utils.ts in order to get the input file path based on the current editor;
 *   - constants.ts in order to get all needed constants.
 * 
 * All customizable displayed text can be founded in constants.ts.
 */

import * as vscode from 'vscode';
import { SpawnSyncReturns, spawnSync } from 'child_process';

import { createTckStatusBarItem } from './tckCommon';
import { parseErrorPosition } from './parseDocument';
import { getCurrentFile } from '../utils';
import { currentEditor } from '../extension';
import { tckPath, tckSyntaxCommand, tckSyntaxCorrectMessage, tckSyntaxErrorMessage, tckSyntaxStatusBarText, tckSyntaxWarningMessage } from '../constants';

// creates tck-syntax status bar
export const tckSyntaxStatusBar = createTckStatusBarItem('tchecker-vscode.tckSyntax', tckSyntaxStatusBarText, 40);


/**
 * Registers tckSyntax command and displays a status bar trigger button.
 * When called, it executes the tck-syntax command
 * (specified in the extension configuration) and the output is parsed.
 * 
 * Please note that it's mandatory to declare the command in the package.json
 * file before using registerCommand (in this case: tchecker-vscode.tckSyntax).
 * 
 * @param diagnosticCollection Container of all diagnostics (errors and warnings)
 * @returns An array of a disposable (the registered command) and a VSC status
 * bar item
 */
export function handleTckSyntax(diagnosticCollection: vscode.DiagnosticCollection) {
	return [
		vscode.commands.registerCommand('tchecker-vscode.tckSyntax', () => {
			const currentFile = getCurrentFile(currentEditor);
			if (currentFile === '') { // no current file
				return; // therefore no execution
			}
	
			diagnosticCollection.clear();
	
			// running tck-syntax and getting the output
			const output: SpawnSyncReturns<string> = spawnSync(tckPath as string + tckSyntaxCommand as string + ' ' + currentFile, { shell: true, encoding: 'utf-8' });
	
			if (output.status !== 0) {
				handleSyntaxErrors(output, diagnosticCollection, currentFile);
			} else {
				handleCorrectSyntax(output, diagnosticCollection, currentFile);
			}
		}),
		tckSyntaxStatusBar
	];
}


/**
 * Handles errors after executing the tck-syntax command.
 * 
 * @param output tck-syntax standard output
 * @param diagnosticCollection Container of all diagnostics (errors and warnings) 
 * @param currentFile Path to the input file
 */
function handleSyntaxErrors(output: SpawnSyncReturns<string>, diagnosticCollection: vscode.DiagnosticCollection, currentFile: string) {
	vscode.window.showErrorMessage(tckSyntaxErrorMessage);
	
	// getting errors
	const errors = parseErrorPosition(output, vscode.DiagnosticSeverity.Error);

	// sending errors to VSCode
	diagnosticCollection.set(vscode.Uri.parse(currentFile), errors);
}


/**
 * Handles correct syntax and warnings of tck-syntax.
 * 
 * @param output tck-syntax standard output
 * @param diagnosticCollection Container of all diagnostics (errors and warnings)
 * @param currentFile Path to the input file
 */
function handleCorrectSyntax(output: SpawnSyncReturns<string>, diagnosticCollection: vscode.DiagnosticCollection, currentFile: string) {
	if (output.stderr !== '') {
		vscode.window.showInformationMessage(tckSyntaxWarningMessage);

		// getting warnings
		const warnings = parseErrorPosition(output, vscode.DiagnosticSeverity.Warning);

		// sending warnings to VSCode
		diagnosticCollection.set(vscode.Uri.parse(currentFile), warnings);
	} else {
		vscode.window.showInformationMessage(tckSyntaxCorrectMessage);
	}
}
