import * as vscode from 'vscode';

import { keywords } from '../constants';

export function keywordsCompletion() {
	return vscode.languages.registerCompletionItemProvider('tchecker', {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			
			function completeItem(item: string) {
				const itemToComplete = new vscode.CompletionItem(item);
				itemToComplete.kind = vscode.CompletionItemKind.Keyword;
				return itemToComplete;
			}
			
			return keywords.map((e) => completeItem(e.name));
		}
	});
}

// testing features (to come: auto-providing events...)
// let currentEvents = [
// 	'x',
// 	'y'
// ];

// // todo: refactoring this code... (this is only a demo)
// export function eventNext() {
// 	return vscode.languages.registerCompletionItemProvider('tchecker', {

// 		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			
// 			const linePrefix = document.lineAt(position).text.substring(0, position.character);
// 			if (!linePrefix.endsWith('event:')) {
// 				return undefined;
// 			}

// 			return currentEvents.map((e) => new vscode.CompletionItem(e, vscode.CompletionItemKind.Variable));
// 		}
// 	},
// 	':'
// 	);
// }
