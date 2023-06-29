import * as vscode from 'vscode';

import { displayStatusBar } from './tckCommon'; 
import { tckPath } from '../constants';

// gets tck-simulate tool from config
const tckCommand : string | undefined = (vscode.workspace.getConfiguration('tchecker-vscode').get('tck-simulate'));

export function handleTckSimulate(diagnosticCollection: vscode.DiagnosticCollection) {
	const terminalName = 'TChecker Simulate';
	const id = getLastestTckTerminalId(terminalName);
	return [ tckSimulateTerminal(diagnosticCollection, terminalName, id), tckSelectTerminal(), displayStatusBar('tchecker-vscode.tckSimulate', 'Launch tck-simulate', 20) ];
}

function getTckTerminalIdx(name: string): number {
	let i = 0;
	const n = vscode.window.terminals.length;
	while (i < n) {
		if (vscode.window.terminals[i].name === name) {
			return i;
		}
		i++;
	}
	return -1;
}

function getLastestTckTerminalId(terminalName: string) {
	let i = 0;
	while (getTckTerminalIdx(`${terminalName} #${i+1}`) !== -1) {
		i+=1;
	}
	return i+1;
}

function tckSimulateTerminal(diagnosticCollection: vscode.DiagnosticCollection, terminalName: string, id: number) {
	return vscode.commands.registerCommand('tchecker-vscode.tckSimulate', () => {

		let currentFile = vscode.window.activeTextEditor?.document.fileName;
		if (currentFile === undefined) {
			currentFile = '';
		}

		diagnosticCollection.clear();

		vscode.window.createTerminal(`${terminalName} #${id++}`);

		const terminalId = getTckTerminalIdx(`${terminalName} #${id-1}`);

		vscode.window.terminals[terminalId].show();
		vscode.window.terminals[terminalId].sendText(tckPath as string + tckCommand as string + ' ' + currentFile);
	});
}

function tckSelectTerminal() {
	return vscode.commands.registerCommand('tchecker-vscode.tckTerminal', () => {
		if (ensureTerminalExists()) {
			selectTerminal().then(terminal => {
				if (terminal) {
					terminal.dispose();
				}
			});
		}
	});
}

function selectTerminal(): Thenable<vscode.Terminal | undefined> {
	interface TerminalQuickPickItem extends vscode.QuickPickItem {
		terminal: vscode.Terminal;
	}
	const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
	const items: TerminalQuickPickItem[] = terminals.map(t => {
		return {
			label: `name: ${t.name}`,
			terminal: t
		};
	});
	return vscode.window.showQuickPick(items).then(item => {
		return item ? item.terminal : undefined;
	});
}

function ensureTerminalExists(): boolean {
	if ((<any>vscode.window).terminals.length === 0) {
		vscode.window.showErrorMessage('No active terminals');
		return false;
	}
	return true;
}
