import { SpawnSyncReturns } from 'child_process';
import * as vscode from 'vscode';

export function getVarAbove(document: vscode.TextDocument, keyword: string, index: number, constraint: string) {
	let pos : vscode.Position;
	let line;
	let i = 0;
	// in order to get defined variables, we consider the current line as the last line for the document analysis
	const lastLine : number =  vscode.window.activeTextEditor?.selection.active.line as number;
	const res : string[] = [];
	while (i < lastLine) {
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
		i++;
	}
	return res;
}

export function parseErrorPosition(output: SpawnSyncReturns<string>, severity: vscode.DiagnosticSeverity) {
	const regex = /[0-9]+-*[0-9]*\b.\b[0-9]+-*[0-9]*/;
	const stderr = output.stderr.split('\n');
	const errors = [];
	let i = 0;

	while (i < stderr.length - 1) {
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
			const pos = new vscode.Position(0, 0);
			const range = new vscode.Range(pos, pos);
			errors.push(new vscode.Diagnostic(range, stderr[i], severity));
		}
		i++;
	}

	return errors;
}
