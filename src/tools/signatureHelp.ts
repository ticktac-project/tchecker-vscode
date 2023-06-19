import * as vscode from 'vscode';

import { Keyword, keywords } from '../constants';


function triggerSignatureHelp(keyword: Keyword) {
	return vscode.languages.registerSignatureHelpProvider('tchecker', {
		provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.SignatureHelpContext) {

			const linePrefix = document.lineAt(position).text.substring(0, position.character);
			if (!linePrefix.endsWith(keyword.name + ':')) {
				return undefined;
			}

			return {
				activeParameter: 0,
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

export function systemSignatureHelp() {
	return keywords.map((e) => triggerSignatureHelp(e));
}
