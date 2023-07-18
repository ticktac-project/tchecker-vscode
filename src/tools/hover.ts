/**	
 * This module provides the VSC hover feature.
 * 
 * All informations are provided by constants.ts.
 */

import * as vscode from 'vscode';
import { Keyword, keywords } from '../constants';

/**
 * Yields information about TChecker's keywords by hovering it.
 * 
 * @param keyword TChecker keyword
 * @returns A disposable
 */
export function triggerHover(keyword: Keyword) {
	return vscode.languages.registerHoverProvider('tchecker', {
		provideHover(document: vscode.TextDocument, position: vscode.Position) {

			const linePrefix = document.lineAt(position).text;

			if (!linePrefix.startsWith(keyword.name + ':')) {
				return undefined;
			}

			return new vscode.Hover([keyword.name.charAt(0).toUpperCase() + keyword.name.slice(1) + ' declaration',keyword.signature,keyword.documentation]);
		}
	});
}


/**
 * Registers all TChecker's keywords.
 * 
 * @returns A disposable
 */
export function handleHover() {
	return keywords.map((e) => triggerHover(e));
}
