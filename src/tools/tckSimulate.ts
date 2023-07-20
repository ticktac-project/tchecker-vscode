/**
 * This module integrates the 'tck-simulate' tool in the extension.
 * 
 * handleTckSimulate registers a VSC command that allows the user to run a
 * simulation on the current editing file.
 * 
 * This simulation is an asynchronous process that requires a user input in
 * order to resume to the next state.
 * 
 * Collecting the user input requires an input box that is automatically
 * triggered. A status bar item allows the user to retrigger the input box
 * if necessary.
 * 
 * It can be tricky to launch more than one simulation at a time (regarding
 * the input collection). Therefore, the module only allows one running
 * simulation at a time.
 * 
 * This module relies on:
 *   - tckCommon.ts in order to create the status bar;
 *   - extention.ts in order to get the current editor;
 *   - utils.ts in order to get the input file path based on the current
 *     editor;
 *   - constants.ts in order to get all needed constants.
 * 
 * All customizable displayed text can be founded in constants.ts.
 */

import * as vscode from 'vscode';
import { spawn, ChildProcessWithoutNullStreams, spawnSync } from 'child_process';

import { createTckStatusBarItem } from './tckCommon'; 
import { getCurrentFile } from '../utils';
import { currentEditor } from '../extension';
import { tckPath, tckSimulateStatusBarText, tckSimulateCommand, tckSimulateRunningErrorMessage, tckSimulateStatusBarTriggerText, tckSimulateInputBoxPlaceholder, tckSimulateInputBoxTitle, tckSimulateOutputWindowExecutionMessage } from '../constants';

// initialization of the simulation counter & the running checker
let nbOfSimulations = 0;
let isRunning = false;

// initialization of status bars & input box
export const tckSimulateStatusBar : vscode.StatusBarItem = initStatusBar();
const tckSimulateInputBoxBar : vscode.StatusBarItem = initInputBoxBar();
const tckSimulateInputBox : vscode.InputBox = initInputBox();


/**
 * Registers tckSimulate command, input box related command and displays a
 * status bar trigger button. When called, it executes the tck-simulate command
 * (specified in the extension configuration) and trigger an input box for
 * interacting with the process.
 * 
 * Please note that it's mandatory to declare the command in the package.json
 * file before using registerCommand (in this case: tchecker-vscode.tckSimulate).
 * 
 * @param diagnosticCollection Container of all diagnostics (errors and warnings)
 * @returns An array of a disposables (the registered tckSimulate command and
 * an input box related command) and a VSC status bar item 
 */
export function handleTckSimulate(diagnosticCollection: vscode.DiagnosticCollection) {
	return [
		vscode.commands.registerCommand('tchecker-vscode.tckSimulate', () => {
			diagnosticCollection.clear();
			
			if (isRunning) {
				vscode.window.showErrorMessage(tckSimulateRunningErrorMessage);
			} else {
				isRunning = true;
				nbOfSimulations++;
				tckSimulate();
			}
		}),
		tckSimulateStatusBar,
		showInputBoxCommand()
	];
}


/**
 * Executes the tck-simulate command as an asynchronous process and listens
 * stdout and stderr.
 * 
 * stdout data is displayed in an output box.
 * 
 * Inputs are provided by the function readlineCall.
 */
function tckSimulate() {
	const currentFile = getCurrentFile(currentEditor);
	if (currentFile === '') { // no current file
		isRunning = false;
		return; // therefore no execution
	}
	
	tckSimulateStatusBar.hide() // hiding tck-simulate launch button
	tckSimulateInputBoxBar.show();
	const outputWindow = initializeOutputWindow();

	// spawning child process
	const spawnOptions = { shell: true, encoding: 'utf-8' };
	const simulation : ChildProcessWithoutNullStreams = spawn(tckPath as string + tckSimulateCommand as string + ' ' + currentFile, spawnOptions);

	// listening child process
	simulation.stdout.on('data', (data) => {
		outputWindow.appendLine(`${data}`);
	});

	// error handling
	simulation.stderr.on('error', (data) => {
		outputWindow.appendLine(`ERROR: ${data}`);
	})

	readlineCall(simulation);
}


/**
 * Asks and waits for a user input while the child process is still alive.
 * 
 * @param simulation The child process
 */
async function readlineCall(simulation: ChildProcessWithoutNullStreams) {
	let result : string | unknown = '';
	while (isAlive(simulation.pid as number)) {
		result = await resolveReadline(simulation.pid as number);
		if (result === 'timeout') {
			break
		}
		simulation.stdin.write(result + '\n');
	}
	closeRoutine();
}


/**
 * Waits for user input and regularly asks if the process is still alive.
 * 
 * In order to detect the death of the child process, the function timeout
 * every half second and check if the process is alive.
 * 
 * @param pid The child process PID
 * @returns A promise
 */
function resolveReadline(pid: number) {
	return new Promise((resolve) => {
			showInputBox();
			tckSimulateInputBox.onDidAccept(() => {
				tckSimulateInputBox.hide();
				resolve(tckSimulateInputBox.value);
			});
			setTimeout(() => {
				isProcessEnded(resolve, pid)
			}, 500);
		}
	);
}


/**
 * Checks if the child process is still running.
 * 
 * @param resolve Promise callback
 * @param pid The child process PID
 */
function isProcessEnded(resolve: ((value: unknown) => void), pid: number) {
	if (isAlive(pid)) {
		setTimeout(() => {
			isProcessEnded(resolve, pid)
		}, 1000);
	} else {
		resolve('timeout')
	}
}


/**
 * Checks if the child process is still alive.
 * 
 * @param pid The child process PID
 * @returns A boolean indicating whether the child process is alive or not
 */
function isAlive(pid: number): boolean {
	const x = spawnSync('ps -p ' + pid + ' | grep ' + pid, { shell: true, encoding: 'utf-8' });
	return (x.stdout.length !== 0);
}


/**
 * Cleans the VSC environnment.
 */
function closeRoutine() {
	tckSimulateInputBoxBar.hide();
	tckSimulateInputBox.hide();
	tckSimulateStatusBar.show();
	isRunning = false;
}


/**
 * Initializes an output window for the simulation.
 * 
 * @returns An output window
 */
function initializeOutputWindow(): vscode.OutputChannel {
	const outputWindow = vscode.window.createOutputChannel('TChecker Simulate #' + nbOfSimulations, 'tchecker');
	outputWindow.appendLine(tckSimulateOutputWindowExecutionMessage);
	outputWindow.appendLine('');
	outputWindow.show();
	return outputWindow;
}


/**
 * Registers a command that shows the input box 
 * 
 * @returns A disposable
 */
function showInputBoxCommand() {
	return vscode.commands.registerCommand('tchecker-vscode.tckSimulateInput', () => {
		tckSimulateInputBox.show();
	});
}


/**
 * Shows the input box with a short delay.
 * 
 * This function is only used after the has submitted an input. The delay is
 * introduced to avoid a display bug.
 */
function showInputBox() {
	setTimeout(() => {
		tckSimulateInputBox.value = ''; // cleaning inputBox
		tckSimulateInputBox.show();
	}, 500);
}


/**
 * Initializes the status bar item for launching a simulation.
 * 
 * @returns A status bar item
 */
function initStatusBar() {
	return createTckStatusBarItem('tchecker-vscode.tckSimulate', tckSimulateStatusBarText, 20);
}


/**
 * Initializes the status bar item for triggering the input box.
 * 
 * @returns A status bar item
 */
function initInputBoxBar() {
	const inputBoxBar = createTckStatusBarItem('tchecker-vscode.tckSimulateInput', tckSimulateStatusBarTriggerText, 10);
	inputBoxBar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
	inputBoxBar.hide();
	return inputBoxBar;
}


/**
 * Initializes the input box.
 * 
 * @returns An input box
 */
function initInputBox() {
	const inputBox = vscode.window.createInputBox();
	inputBox.title = tckSimulateInputBoxTitle;
	inputBox.placeholder = tckSimulateInputBoxPlaceholder;
	return inputBox;
}
