import * as vscode from 'vscode';

export function keywordsCompletion() {
	return vscode.languages.registerCompletionItemProvider('tchecker', {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			
			const systemCompletion = new vscode.CompletionItem('system');
			systemCompletion.kind = vscode.CompletionItemKind.Keyword;
			
			// todo: others keyworkds

			return [
				systemCompletion,
			];
		}
	});
}

// testing features (to come: auto-providing events...)
let currentEvents = [
	'x',
	'y'
];

// todo: refactoring this code... (this is only a demo)
export function eventNext() {
	return vscode.languages.registerCompletionItemProvider('tchecker', {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			
			const linePrefix = document.lineAt(position).text.substring(0, position.character);
			if (!linePrefix.endsWith('event:')) {
				return undefined;
			}

			return currentEvents.map((e) => new vscode.CompletionItem(e, vscode.CompletionItemKind.Variable));
		}
	},
	':'
	);
}
