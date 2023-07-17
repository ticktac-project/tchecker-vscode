/**
 * This module [...]
 * 
 * [...]
 */

import * as vscode from 'vscode';

export function displayStatusBar(tckCommand: string, name: string, priority: number) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, priority);
	statusBarItem.command = tckCommand;
	statusBarItem.text = name;
	statusBarItem.show();
	return statusBarItem;
}


