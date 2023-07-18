/**
 * This module provides utility functions.
 */

import * as vscode from 'vscode';
import { getCurrentFileErrorMessage } from './constants';


/**
 * Counts the number of occurrences of 'c' in s.
 * 
 * @param s A string
 * @param c The targeted character
 * @returns The number of occurrences of 'c' in s
 */
export function countChar(s: string, c: string) : number {
	let cnt = -1;
	for (let idx = 0; idx !== -1; idx=s.indexOf(c,idx+1)) {
		cnt++;
	}
	return cnt;
}


/**
 * Gets the current (or latest) editing file.
 * 
 * @param currentEditor The current (or latest) VSC editor
 * @returns The current (or latest) editing file
 */
export function getCurrentFile(currentEditor: vscode.TextEditor) {
	const currentFile = currentEditor.document.uri.fsPath;
	if (currentFile === '') {
		vscode.window.showErrorMessage(getCurrentFileErrorMessage);
	}
	return currentFile;
}
