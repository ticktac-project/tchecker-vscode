import * as vscode from 'vscode';

export function systemSignatureHelp() {
	return vscode.languages.registerSignatureHelpProvider('tchecker', {
		
		provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.SignatureHelpContext) {

			const linePrefix = document.lineAt(position).text.substring(0, position.character);
			if (!linePrefix.endsWith('system:')) {
				return undefined;
			}

			return {
				activeParameter: 0,
				activeSignature: 0,
				signatures: [{
					label: 'system:id{attributes}',
					documentation: 'Declares a system with identifier id and given attributes. There shall be only one system declaration in a TChecker file. And it shall appear as the first declaration in the file.',
					parameters: [
						{
							label: 'id',
							documentation: 'System\'s identifier.'
						},
						{
							label: '{attributes}',
							documentation: 'Optional.'
						}
					]
				}]
			};
		}
	},
	':');
}
