/**
 * This modules provides signature help support for TChecker's keywords.
 * 
 * All informations (signature, documentation, ...) about keywords are available
 * in constants.ts.
 */

import * as vscode from 'vscode';

import { Keyword, keywords } from '../constants';
import { countChar } from '../utils';


/**
 * Parses and applies signature help informations to a declaration.
 * 
 * @param keyword TChecker keyword
 * @returns A disposable
 */
function triggerSignatureHelp(keyword: Keyword) {
	return vscode.languages.registerSignatureHelpProvider('tchecker', {
		provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position) {

			const linePrefix = document.lineAt(position).text.substring(0, position.character);

			const nbOfColon = countChar(linePrefix,':');
			const nbOfOpenBracket = countChar(linePrefix,'{');

			if (!linePrefix.startsWith(keyword.name + ':') || (nbOfColon > keyword.attributePos) || (nbOfOpenBracket > 1) || (nbOfOpenBracket == 1 && nbOfColon < keyword.attributePos)) {
				return undefined;
			}

			return {
				activeParameter: (nbOfOpenBracket == 1) ? keyword.attributePos : (nbOfColon - 1),
				activeSignature: 0,
				signatures: [{
					label: keyword.signature,
					documentation: keyword.documentation,
					parameters: keyword.parameters
				}]
			};
		}
	},
	':','{');
}


/**
 * Registers all TChecker's keywords.
 * 
 * @returns A disposable
 */
export function systemSignatureHelp() {
	return keywords.map((e) => triggerSignatureHelp(e));
}
