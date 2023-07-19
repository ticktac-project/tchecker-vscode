/**
 * This modules provides auto-completion for TChecker input format.
 * 
 * handleAutoCompletion registers all expected auto-completion functions defined
 * in this module.
 * 
 * This module relies on:
 *   - parseDocument.ts in order to get variables above a certain position;
 *   - utils.ts in order to count the occurences of a character in a declaration;
 *   - constants.ts in order to get all needed constants.
 * 
 * All customizable displayed text can be founded in constants.ts.
 */

import * as vscode from 'vscode';

import { getVarAbove } from './parseDocument';
import { keywords } from '../constants';
import { countChar } from '../utils';


/**
 * Combines all auto-completion function in a disposable for VSC.
 * 
 * @returns A disposable
 */
export function handleAutoCompletion() {
	return vscode.Disposable.from(handleKeywords(), handleLocation(), handleEdge(), handleSync());
}


/**
 * Transforms a string item into a VSC completion item.
 * 
 * @param item 
 * @returns 
 */
function completeItem(item: string) {
	const itemToComplete = new vscode.CompletionItem(item);
	itemToComplete.kind = vscode.CompletionItemKind.Keyword; // we only work with keywords
	return itemToComplete;
}


/**
 * Registers auto-completion for TChecker keywords.
 * 
 * The function check if there is no colon or open bracket. If it's the case,
 * it's sensible to allow auto-completion for keywords. Otherwise, it's not.
 * 
 * @returns A disposable
 */
function handleKeywords() {
	return vscode.languages.registerCompletionItemProvider('tchecker', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			const line = document.lineAt(position).text.substring(0, position.character);
			const nbOfColon = countChar(line,':');
			const nbOfOpenBracket = countChar(line,'{');

			if (nbOfColon > 0 || nbOfOpenBracket > 0) { // no auto-completion
				return undefined;
			}

			return keywords.map((e) => completeItem(e.name));
		}
	});
}

/**
 * Registers auto-completion for variables in a TChecker declaration.
 * 
 * This function is generic and therefore is used by all auto-completion functions.
 * 
 * For accuracy purposes, we target a specific position in a specific declaration.
 * The keyword variable target the concerned declaration. The array variables
 * contains all possible matching variables for auto-suggestion.
 * 
 * Auto-completion is triggered by entering a colon. Therefore, we specify a starting
 * colon to discriminate between possibilities.
 * 
 * Others conditions can be added, such as allowing retriggering or not.
 * 
 * @param document VSC current editing document
 * @param position VSC user position in the text document
 * @param keyword TChecker keyword
 * @param variables Array of all possible variables
 * @param startingColon Index of the starting colon in the declaration
 * @param isRetriggerable A boolean, must be true if the auto-completion should be retrigger
 * @param others An additional condition, must be false if no need of it
 * @returns A disposable
 */
function handleAutoCompletionWithConstraint(document: vscode.TextDocument, position: vscode.Position, keyword: string, variables: string[], startingColon: number, isRetriggerable: boolean, others: boolean) {
	const line = document.lineAt(position).text.substring(0, position.character);
	const nbOfColon = countChar(line,':');
	const nbOfOpenBracket = countChar(line,'{');
	const retriggerOption = ((isRetriggerable) ? (nbOfColon === 0) : (nbOfColon !== startingColon));
	if (!line.startsWith(keyword + ':') || nbOfOpenBracket !== 0 || retriggerOption || others) { // no auto-completion
		return undefined;
	}

	return variables.map((e) => completeItem(e));
}


/**
 * Registers auto-completion for locations.
 * 
 * This function is based on handleAutoCompletionWithConstraint, targeted the
 * keyword 'location' and suggest any processId string after the first colon.
 * 
 * processId is an array containing all TChecker processes defined above position.
 * 
 * @returns A disposable
 */
function handleLocation() {
	return vscode.languages.registerCompletionItemProvider('tchecker', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			const processId = getVarAbove(document, 'process', 1, '');
			return handleAutoCompletionWithConstraint(document, position, 'location', processId, 1, false, false);
		}
	}, ':');
}


/**
 * Registers auto-completion for edges.
 * 
 * This function provides auto-completion suggestions for each steps of an edge
 * declaration.
 * 
 * @returns A disposable
 */
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


/**
 * Registers auto-completion for synchronisations.
 * 
 * This function provides auto-completion suggestions for each steps of a
 * synchronisation declaration.
 * 
 * A particularity of synchronisations is that there can be retriggered.
 * 
 * @returns A disposable
 */
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
