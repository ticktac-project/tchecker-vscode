import * as vscode from 'vscode';

import { Keyword, keywords } from '../constants';

function countCar(s: string, c: string) : number {
	let cnt : number = 0;
	const n : number = s.length;
	let i : number = 0;
	while (i < n) {
		if (s[i] === c) {
			cnt++;
		}
		i++;
	}
	return cnt; 
}

// todo: generalize (code duplication...)
function triggerSignatureHelp(keyword: Keyword) {
	return vscode.languages.registerSignatureHelpProvider('tchecker', {
		provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.SignatureHelpContext) {

			const linePrefix = document.lineAt(position).text.substring(0, position.character);
			//console.log(countCar(linePrefix,':'));

			let nbOfColon = countCar(linePrefix,':');

			if (!linePrefix.startsWith(keyword.name + ':') || (nbOfColon > keyword.attributePos)) {
				return undefined;
			}

			return {
				activeParameter: nbOfColon - 1,
				activeSignature: 0,
				signatures: [{
					label: keyword.signature,
					documentation: keyword.documentation,
					parameters: keyword.parameters
				}]
			};
		}
	},
	':');
}

function triggerAttributeSignatureHelp(keyword: Keyword) {
	return vscode.languages.registerSignatureHelpProvider('tchecker', {
		provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.SignatureHelpContext) {
			
			const linePrefix = document.lineAt(position).text.substring(0, position.character);
			let nbOfColon = countCar(linePrefix,':');
			if ((!linePrefix.startsWith(keyword.name + ':')) || (!linePrefix.endsWith('{')) || (nbOfColon != keyword.attributePos)) {
				return undefined;
			}

			return {
				activeParameter: keyword.attributePos,
				activeSignature: 0,
				signatures: [{
					label: keyword.signature,
					documentation: keyword.documentation,
					parameters: keyword.parameters
				}]
			};
		}
	},
	'{');
}


export function systemSignatureHelp() {
	return keywords.map((e) => triggerSignatureHelp(e)).concat(keywords.map((e) => triggerAttributeSignatureHelp(e)));
}
