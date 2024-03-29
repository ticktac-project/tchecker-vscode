/**
 * This module provides common functions for TChecker tools.
 */

import * as vscode from 'vscode';

/**
 * Creates a new status bar and displays it.
 * 
 * @param tckCommand The associated VSC command
 * @param name The displayed name of the status bar item
 * @param priority The priority of the status bar (e.g. the position within others status bar items)
 * @returns The new status bar item
 */
export function createTckStatusBarItem(tckCommand: string, name: string, priority: number) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, priority);
	statusBarItem.command = tckCommand;
	statusBarItem.text = name;
	statusBarItem.show();
	return statusBarItem;
}


/**
 * Shows all TChecker's status bar items.
 * 
 * @param statusBarItems Array of TChecker's status bar items
 */
export function showTckStatusBarItem(statusBarItems: vscode.StatusBarItem[]) {
	statusBarItems.map((e) => e.show());
}


/**
 * Hides all TChecker's status bar items.
 * 
 * @param statusBarItems Array of TChecker's status bar items
 */
export function hideTckStatusBarItem(statusBarItems: vscode.StatusBarItem[]) {
	statusBarItems.map((e) => e.hide());
}
