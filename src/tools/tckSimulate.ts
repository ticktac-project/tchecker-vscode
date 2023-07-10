import * as vscode from 'vscode';
import { spawn, ChildProcessWithoutNullStreams, spawnSync } from 'child_process';

import { displayStatusBar } from './tckCommon'; 
import { tckPath } from '../constants';

// gets tck-simulate tool from config
const tckCommand : string | undefined = (vscode.workspace.getConfiguration('tchecker-vscode').get('tck-simulate'));

let nbOfSimulate : number = 0;

let isRunning : boolean = false;
const runningErrorMessage : string = 'tck-simulate is already running... Please close the current execution (by using \'q\' in the input box).';

const tckSimulateStatusBar : vscode.StatusBarItem = displayStatusBar('tchecker-vscode.tckSimulate', 'Launch tck-simulate', 20);

const tckSimulateInputBoxBar = displayStatusBar('tchecker-vscode.tckSimulateInput', 'Show input box (tck-simulate)', 10);
tckSimulateInputBoxBar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
tckSimulateInputBoxBar.hide();

const tckSimulateInputBox : vscode.InputBox = vscode.window.createInputBox();
tckSimulateInputBox.title = 'tck-simulate';
tckSimulateInputBox.placeholder = 'Next state...';

export function handleTckSimulate(diagnosticCollection: vscode.DiagnosticCollection) {
	return [vscode.commands.registerCommand('tchecker-vscode.tckSimulate', () => {
		let currentFile = vscode.window.activeTextEditor?.document.fileName;
		if (currentFile === undefined) {
			currentFile = '';
		}

		diagnosticCollection.clear();

		if (isRunning) {
			vscode.window.showErrorMessage(runningErrorMessage);
		} else {
			isRunning = true;
			nbOfSimulate++;
			tckSimulate(currentFile);
		}
	}), tckSimulateStatusBar, showInputBoxCommand() ];
}

function tckSimulate(currentFile: string) {
	tckSimulateStatusBar.hide() // hiding tck-simulate launch button
	tckSimulateInputBoxBar.show();
	const outputWindow = initializeOutputWindow();

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

	readlineCall(simulation);
}

function initializeOutputWindow(): vscode.OutputChannel {
	const outputWindow = vscode.window.createOutputChannel('TChecker Simulate #' + nbOfSimulate, 'tchecker');
	outputWindow.appendLine('Executing tck-simulate...');
	outputWindow.appendLine('');
	outputWindow.show();
	return outputWindow;
}

function isProcessEnded(resolve: ((value: unknown) => void), pid: number) {
	if (isAlive(pid)) {
		setTimeout(() => isProcessEnded(resolve, pid), 1000);
	} else resolve('timeout');
}

function resolveReadline(pid: number) {
	return new Promise((resolve) => {
			showInputBox();
			tckSimulateInputBox.onDidAccept(() => {
				tckSimulateInputBox.hide();
				resolve(tckSimulateInputBox.value);
			});
			setTimeout(() => isProcessEnded(resolve, pid), 500);
		}
	);
}

async function readlineCall(simulation: ChildProcessWithoutNullStreams) {
	let result : string | unknown = '';
	while (true) {
		result = await resolveReadline(simulation.pid as number);
		if (result === 'timeout') {
			break
		};
		simulation.stdin.write(result + '\n');
	}
	closeRoutine();
}

function isAlive(pid: number): boolean {
	const x = spawnSync('ps -p ' + pid + ' | grep ' + pid, { shell: true, encoding: 'utf-8' });
	return x.stdout.length !== 0;
}

function closeRoutine() {
	tckSimulateInputBoxBar.hide();
	tckSimulateInputBox.hide();
	tckSimulateStatusBar.show();
	isRunning = false;
}

function showInputBoxCommand() {
	return vscode.commands.registerCommand('tchecker-vscode.tckSimulateInput', () => {
		tckSimulateInputBox.show();
	});
}

function showInputBox() {
	setTimeout(() => {
		tckSimulateInputBox.value = ''; // cleaning inputBox
		tckSimulateInputBox.show();
	}, 500);
}
