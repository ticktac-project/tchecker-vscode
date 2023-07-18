import * as vscode from 'vscode';

import { keywords } from '../constants';
import { getVarAbove } from './parseDocument';
import { countChar } from '../utils';

function completeItem(item: string) {
	const itemToComplete = new vscode.CompletionItem(item);
	itemToComplete.kind = vscode.CompletionItemKind.Keyword;
	return itemToComplete;
}

function handleKeywords() {
	return vscode.languages.registerCompletionItemProvider('tchecker', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			const line = document.lineAt(position).text.substring(0, position.character);
			const nbOfColon = countChar(line,':');
			const nbOfOpenBracket = countChar(line,'{');

			if (nbOfColon > 0 || nbOfOpenBracket > 0) {
				return undefined;
			}

			return keywords.map((e) => completeItem(e.name));
		}
	});
}

function handleAutoCompletionWithConstraint(document: vscode.TextDocument, position: vscode.Position, keyword: string, variables: string[], startingColon: number, isRetriggerable: boolean, others: boolean) {
	const line = document.lineAt(position).text.substring(0, position.character);
	const nbOfColon = countChar(line,':');
	const nbOfOpenBracket = countChar(line,'{');
	const retriggerOption = ((isRetriggerable) ? (nbOfColon === 0) : (nbOfColon !== startingColon));
	if (!line.startsWith(keyword + ':') || nbOfOpenBracket !== 0 || retriggerOption || others) {
		return undefined;
	}

	return variables.map((e) => completeItem(e));
}

function handleLocation() {
	return vscode.languages.registerCompletionItemProvider('tchecker', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			const processId = getVarAbove(document, 'process', 1, '');
			return handleAutoCompletionWithConstraint(document, position, 'location', processId, 1, false, false);
		}
	}, ':');
}

function handleEdge() {
	const handleEdgeProcess = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const processId = getVarAbove(document, 'process', 1, '');
				return handleAutoCompletionWithConstraint(document, position, 'edge', processId, 1, false, false);
			}
		}, ':');
	};
	const handleEdgeSource = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const line = document.lineAt(position).text;
				const targettedProcess = line.split(':')[1];
				const locationId = getVarAbove(document, 'location', 2, targettedProcess);
				
				return handleAutoCompletionWithConstraint(document, position, 'edge', locationId, 2, false, false);
			}
		}, ':');
	};
	const handleEdgeLocationTarget = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const line = document.lineAt(position).text;
				const targettedProcess = line.split(':')[1];
				const locationId = getVarAbove(document, 'location', 2, targettedProcess);

				return handleAutoCompletionWithConstraint(document, position, 'edge', locationId, 3, false, false);
			}
		}, ':');
	};
	const handleEdgeEvent = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const eventId = getVarAbove(document, 'event', 1, '');
				return handleAutoCompletionWithConstraint(document, position, 'edge', eventId, 4, false, false);
			}
		}, ':');
	};

	return vscode.Disposable.from(handleEdgeProcess(), handleEdgeSource(), handleEdgeLocationTarget(), handleEdgeEvent());
}

function handleSync() {
	const handleSyncProcess = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const line = document.lineAt(position).text;
				const nbOfColon = countChar(line,':');
				const nbOfAt = countChar(line,'@');
				const atNeqColon = (nbOfColon !== nbOfAt + 1);
				
				const processId = getVarAbove(document, 'process', 1, '');
				return handleAutoCompletionWithConstraint(document, position, 'sync', processId, 1, true, atNeqColon);
			}
		}, ':');
	};
	const handleSyncEvent = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const line = document.lineAt(position).text;
				const nbOfColon = countChar(line,':');
				const nbOfAt = countChar(line,'@');
				const atNeqColon = (nbOfColon !== nbOfAt);

				const targettedProcess = line.split(':')[nbOfColon].split('@')[0];

				const eventId = getVarAbove(document, 'edge', 4, targettedProcess);
				return handleAutoCompletionWithConstraint(document, position, 'sync', eventId, 1, true, atNeqColon);
			}
		}, '@');
	};

	return vscode.Disposable.from(handleSyncProcess(), handleSyncEvent()); 
}

export function handleAutoCompletion() {
	return vscode.Disposable.from(handleKeywords(), handleLocation(), handleEdge(), handleSync());
}
