import * as vscode from 'vscode';

import { keywords } from '../constants';

function completeItem(item: string) {
	const itemToComplete = new vscode.CompletionItem(item);
	itemToComplete.kind = vscode.CompletionItemKind.Keyword;
	return itemToComplete;
}

export function keywordsCompletion() {
	return vscode.languages.registerCompletionItemProvider('tchecker', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			return keywords.map((e) => completeItem(e.name));
		}
	});
}
