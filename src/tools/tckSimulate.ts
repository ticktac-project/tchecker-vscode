import * as vscode from 'vscode';
import { spawn, ChildProcessWithoutNullStreams, spawnSync } from 'child_process';

import { displayStatusBar } from './tckCommon'; 
import { tckPath } from '../constants';

// gets tck-simulate tool from config
const tckCommand : string | undefined = (vscode.workspace.getConfiguration('tchecker-vscode').get('tck-simulate'));

let isRunning = false;

export function handleTckSimulate(diagnosticCollection: vscode.DiagnosticCollection) {
	// status bar and input box init
	const tckSimulateBar : vscode.StatusBarItem = displayStatusBar('tchecker-vscode.tckSimulate', 'Launch tck-simulate', 20);
	const inputBox : vscode.InputBox = vscode.window.createInputBox();
	inputBox.title = 'tck-simulate';
	inputBox.placeholder = 'Next state...';

	return [vscode.commands.registerCommand('tchecker-vscode.tckSimulate', () => {
		let currentFile = vscode.window.activeTextEditor?.document.fileName;
		if (currentFile === undefined) {
			currentFile = '';
		}

		diagnosticCollection.clear();

		if (isRunning) {
			vscode.window.showErrorMessage('tck-simulate is already running... Please close the current execution (by using \'q\' in the input box).');
		} else {
			isRunning = true;
			tckSimulate(currentFile, tckSimulateBar, inputBox);
		}
	}), tckSimulateBar, showInputBoxCommand(inputBox) ];
}

function tckSimulate(currentFile: string, statusBarItem: vscode.StatusBarItem, inputBox: vscode.InputBox) {
	statusBarItem.hide() // hiding tck-simulate launch button
	const inputBoxBar = displayStatusBar('tchecker-vscode.tckSimulateInput', 'Show input box (tck-simulate)', 10);
	inputBoxBar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
	const outputWindow = vscode.window.createOutputChannel('TChecker', 'tchecker');
	outputWindow.appendLine('Executing tck-simulate...');
	outputWindow.appendLine('');
	outputWindow.show();

	// spawning child process
	const spawnOptions = { shell: true, encoding: 'utf-8' };
	const simulation : ChildProcessWithoutNullStreams = spawn(tckPath as string + tckCommand as string + ' ' + currentFile, spawnOptions);

	// watching child process
	simulation.stdout.on('data', (data) => {
		outputWindow.appendLine(`${data}`);
	});

	// error handling
	simulation.stderr.on('error', (data) => {
		outputWindow.appendLine(`ERROR: ${data}`);
	})

	readlineCall(simulation, inputBox, inputBoxBar, statusBarItem);
}

function isProcessEnded(resolve: ((value: unknown) => void), pid: number) {
	if (isAlive(pid)) {
		setTimeout(() => isProcessEnded(resolve, pid), 1000);
	} else resolve('timeout');
}

function resolveReadline(inputBox: vscode.InputBox, pid: number) {
	return new Promise((resolve) => {
			showInputBox(inputBox);
			inputBox.onDidAccept(() => {
				inputBox.hide();
				resolve(inputBox.value);
			});
			setTimeout(() => isProcessEnded(resolve, pid), 500);
		}
	);
}

async function readlineCall(simulation: ChildProcessWithoutNullStreams, inputBox: vscode.InputBox, inputBoxBar: vscode.StatusBarItem, bar: vscode.StatusBarItem) {
	let result : string | unknown = '';
	while (true) {
		result = await resolveReadline(inputBox, simulation.pid as number);
		if (result === 'timeout') {
			break
		};
		simulation.stdin.write(result + '\n');
	}
	closeRoutine(inputBox, inputBoxBar, bar);
}

function isAlive(pid: number): boolean {
	const x = spawnSync('ps -p ' + pid + ' | grep ' + pid, { shell: true, encoding: 'utf-8' });
	return x.stdout.length !== 0;
}

function closeRoutine(inputBox: vscode.InputBox, inputBoxBar: vscode.StatusBarItem, bar: vscode.StatusBarItem) {
	inputBox.hide();
	inputBoxBar.hide();
	bar.show();
	isRunning = false;
}

function showInputBoxCommand(inputBox: vscode.InputBox) {
	return vscode.commands.registerCommand('tchecker-vscode.tckSimulateInput', () => {
		inputBox.show();
	});
}

function showInputBox(inputBox: vscode.InputBox) {
	setTimeout(() => {
		inputBox.value = ''; // cleaning inputBox
		inputBox.show();
	}, 500);
}
