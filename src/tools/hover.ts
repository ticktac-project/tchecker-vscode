import * as vscode from 'vscode';

import { Keyword, keywords } from '../constants';

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

export function handleHover() {
	return keywords.map((e) => triggerHover(e));
}
