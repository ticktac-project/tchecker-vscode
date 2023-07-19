/**
 * This module provides tools for document parsing.
 */

import { SpawnSyncReturns } from 'child_process';

import * as vscode from 'vscode';


/**
 * Gets all variables associated to a TChecker keyword above the user position
 * in the text document.
 * 
 * In order to target a specific variable, we specify the associated keyword,
 * and the position of the variable in the declaration.
 * 
 * See: https://github.com/ticktac-project/tchecker/wiki/TChecker-file-format for
 * more information about the expected index of the different variables.
 * 
 * @param document VSC document
 * @param keyword TChecker's keyword
 * @param index The position of the variable in the declaration (0 is the keyword,
 *              1 is the next variable...)
 * @param constraint Additional constraint (can be left blank, i.e. '')
 * @returns An array of targeted TChecker's variables
 */
export function getVarAbove(document: vscode.TextDocument, keyword: string, index: number, constraint: string) {
	let pos : vscode.Position;
	let line;
	// in order to get defined variables, we consider the current line as the last line for the document analysis
	const lastLine : number =  vscode.window.activeTextEditor?.selection.active.line as number;
	const res : string[] = [];
	for (let i = 0; i < lastLine; i++) {
		pos = new vscode.Position(i, 0);
		line = document.lineAt(pos).text;
		if (line.startsWith(keyword + '')) {
			const value = (line.split(':')[index]).split('{')[0];
			if (constraint != '') {
				if (line.match(constraint)) {
					if (!res.includes(value))
						res.push(value);
				}
			} else {
				res.push(value);
			}
		}
	}
	return res;
}


/**
 * Parses error and warning messages from TChecker's output.
 * 
 * @param output Child process output
 * @param severity Error severity (either error or warning)
 * @returns An array of VSC diagnostics
 */
export function parseErrorPosition(output: SpawnSyncReturns<string>, severity: vscode.DiagnosticSeverity) {
	const regex = /[0-9]+-*[0-9]*\b.\b[0-9]+-*[0-9]*/;
	const stderr = output.stderr.split('\n');
	const errors = [];

	for (let i = 0; i < stderr.length - 1; i++) {
		const errorPosition = stderr[i].match(regex);
		if (errorPosition !== null) {
			if (errorPosition[0] !== '') {
				const [line, col] = errorPosition[0].split('.');
				const [lineBegin, lineEnd] = line.split('-');
				const [colBegin, colEnd] = col.split('-');

				const posBegin = new vscode.Position(parseInt(lineBegin) - 1, parseInt(colBegin) - 1);
				const posEnd = new vscode.Position(((lineEnd !== undefined) ? (parseInt(lineEnd) - 1) : (parseInt(lineBegin) - 1)), ((colEnd !== undefined) ? (parseInt(colEnd)) : (parseInt(colBegin) - 1)));

				const range = new vscode.Range(posBegin, posEnd);
				errors.push(new vscode.Diagnostic(range, stderr[i], severity));
			}
		} else {
			const pos = new vscode.Position(0, 0); // default error position if not found
			const range = new vscode.Range(pos, pos);
			errors.push(new vscode.Diagnostic(range, stderr[i], severity));
		}
	}

	return errors;
}
