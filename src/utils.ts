import * as vscode from 'vscode';
import { getCurrentFileErrorMessage } from './constants';

export function countCar(s: string, c: string) : number {
	let cnt = -1;
	for (let idx = 0; idx !== -1; idx=s.indexOf(c,idx+1)) {
		cnt++;
	}
	return cnt;
}

export function getCurrentFile(currentEditor: vscode.TextEditor) {
	const currentFile = currentEditor.document.uri.fsPath;
	if (currentFile === '') {
		vscode.window.showErrorMessage(getCurrentFileErrorMessage);
	}
	return currentFile;
}
