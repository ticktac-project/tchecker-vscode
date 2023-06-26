import * as vscode from 'vscode';

import { keywords } from '../constants';
import { getVarAbove } from './parseDocument';
import { countCar } from '../utils';

function completeItem(item: string) {
	const itemToComplete = new vscode.CompletionItem(item);
	itemToComplete.kind = vscode.CompletionItemKind.Keyword;
	return itemToComplete;
}

function handleKeywords() {
	return vscode.languages.registerCompletionItemProvider('tchecker', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			const line = document.lineAt(position).text.substring(0, position.character);
			const nbOfColon = countCar(line,':');
			const nbOfOpenBracket = countCar(line,'{');

			if (nbOfColon > 0 || nbOfOpenBracket > 0) {
				return undefined;
			}

			return keywords.map((e) => completeItem(e.name));
		}
	});
}

function handleAutoCompletionWithConstraint(document: vscode.TextDocument, position: vscode.Position, keyword: string, variables: string[], startingColon: number, isRetriggerable: boolean) {
	const line = document.lineAt(position).text.substring(0, position.character);
	const nbOfColon = countCar(line,':');
	const nbOfOpenBracket = countCar(line,'{');
	const retriggerOption = ((isRetriggerable) ? (nbOfColon === 0) : (nbOfColon !== startingColon));
	if (!line.startsWith(keyword + ':') || nbOfOpenBracket !== 0 || retriggerOption) {
		return undefined;
	}

	return variables.map((e) => completeItem(e));
}

function handleLocation() {
	return vscode.languages.registerCompletionItemProvider('tchecker', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			const processId = getVarAbove(document, 'process', 1);
			return handleAutoCompletionWithConstraint(document, position, 'location', processId, 1, false);
		}
	}, ':');
}

function handleEdge() {
	const handleEdgeProcess = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const processId = getVarAbove(document, 'process', 1);
				return handleAutoCompletionWithConstraint(document, position, 'edge', processId, 1, false);
			}
		}, ':');
	};
	const handleEdgeSource = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const locationId = getVarAbove(document, 'location', 2);
				return handleAutoCompletionWithConstraint(document, position, 'edge', locationId, 2, false);
			}
		}, ':');
	};
	const handleEdgeLocationTarget = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const locationId = getVarAbove(document, 'location', 2);
				return handleAutoCompletionWithConstraint(document, position, 'edge', locationId, 3, false);
			}
		}, ':');
	};
	const handleEdgeEvent = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const eventId = getVarAbove(document, 'event', 1);
				return handleAutoCompletionWithConstraint(document, position, 'edge', eventId, 4, false);
			}
		}, ':');
	};

	return vscode.Disposable.from(handleEdgeProcess(), handleEdgeSource(), handleEdgeLocationTarget(), handleEdgeEvent());
}

function handleSync() {
	const handleSyncProcess = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const processId = getVarAbove(document, 'process', 1);
				return handleAutoCompletionWithConstraint(document, position, 'sync', processId, 1, true);
			}
		}, ':');
	};
	const handleSyncEvent = () => {
		return vscode.languages.registerCompletionItemProvider('tchecker', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const eventId = getVarAbove(document, 'event', 1);
				return handleAutoCompletionWithConstraint(document, position, 'sync', eventId, 1, true);
			}
		}, '@');
	};

	return vscode.Disposable.from(handleSyncProcess(), handleSyncEvent()); 
}

export function handleAutoCompletion() {
	return vscode.Disposable.from(handleKeywords(), handleLocation(), handleEdge(), handleSync());
}
