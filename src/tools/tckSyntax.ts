import * as vscode from 'vscode';
import { execSync } from 'child_process';

// Gets the TChecker build path
let tcheckerPath = vscode.workspace.getConfiguration('tchecker-vscode').get('path');
 
export const handleTckSyntax = vscode.commands.registerCommand('tchecker-vscode.tckSyntax', () => {
		let currentFile = vscode.window.activeTextEditor?.document.fileName;

		let output;
		try {
			output = execSync(tcheckerPath + "/src/tck-syntax -c " + currentFile, { encoding: 'utf-8' });
			// perhaps reconsidering the path...
		} catch (error) {
			// todo: catch errors messages
			output = "error...";
		}
		console.log(output);
		if (output !== "error...") {
			vscode.window.showInformationMessage('Syntax OK.');
		} else {
			vscode.window.showErrorMessage('An error has occurred. Please check the \'Problems\' panel for more details.'); // todo: actualy show these problems...
		} // todo: handle warnings + handle error due to invalid path...
	});
