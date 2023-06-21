import * as vscode from 'vscode';

import { Keyword, keywords } from '../constants';
import { countCar } from '../utils';

function triggerSignatureHelp(keyword: Keyword) {
	return vscode.languages.registerSignatureHelpProvider('tchecker', {
		provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.SignatureHelpContext) {

			const linePrefix = document.lineAt(position).text.substring(0, position.character);

			let nbOfColon = countCar(linePrefix,':');
			let nbOfOpenBracket = countCar(linePrefix,'{');

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

export function systemSignatureHelp() {
	return keywords.map((e) => triggerSignatureHelp(e));
}
