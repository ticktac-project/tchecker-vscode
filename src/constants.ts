import * as vscode from 'vscode';

export type Keyword = {
	name: string,
	signature: string,
	documentation: string,
	parameters: vscode.ParameterInformation[],
	attributePos: number
}

// gets the TChecker build path from config
export const tckPath : string | undefined = vscode.workspace.getConfiguration('tchecker-vscode').get('path');

// gets TChecker commands from config
export const tckSyntaxCommand : string | undefined = (vscode.workspace.getConfiguration('tchecker-vscode').get('tck-syntax'));
export const tckSimulateCommand : string | undefined = (vscode.workspace.getConfiguration('tchecker-vscode').get('tck-simulate'));

// status bar text
export const tckSyntaxStatusBarText = 'Check Syntax';
export const tckReachLivenessStatusBarText = 'Model Checking';
export const tckSimulateStatusBarText = 'Interactive Simulation';
export const tckSimulateStatusBarTriggerText = 'Show input box (tck-simulate)';

// utils
export const getCurrentFileErrorMessage = 'Failed to recognise the input file. Please run the command with a tck file open.';

// tck-syntax
export const tckSyntaxErrorMessage = 'An error has occurred. Please check the \'Problems\' panel for more details.';
export const tckSyntaxWarningMessage = 'Syntax OK. Warning(s) detected, please check the \'Problems\' panel for more details.';
export const tckSyntaxCorrectMessage = 'Syntax OK.';

// tck-simulate
export const tckSimulateRunningErrorMessage = 'tck-simulate is already running... Please close the current execution (by using \'q\' in the input box).';
export const tckSimulateInputBoxTitle = 'tck-simulate';
export const tckSimulateInputBoxPlaceholder = 'Next state...';
export const tckSimulateOutputWindowExecutionMessage = 'Executing tck-simulate...';

export const keywords : Keyword[] = [
	{
		name: 'system',
		signature: 'system:id{attributes}',
		documentation: 'Declares a system with identifier id and given attributes. There shall be only one system declaration in a TChecker file. And it shall appear as the first declaration in the file.',
		parameters: [
			{
				label: 'id',
				documentation: 'System\'s identifier.'
			},
			{
				label: 'attributes',
				documentation: 'The {attributes} part of the declaration can be ommitted if no attribute is associated to the system (or it can be left empty: {}).'
			}
		],
		attributePos: 1
	},
	{
		name: 'process',
		signature: 'process:id{attributes}',
		documentation: 'Declares a process with identifier id and given attributes. No other process shall have the same identifier.\n\nA process declaration declares a process name. It does not declare a new scope. Hence all declarations following the process declaration are in the global scope.\n\nThere is no way to declare a type of process, and instantiate it in TChecker. In order to specify several instances of the same process type, the process declaration and all the related declarations (locations, edges, etc) shall be duplicated. This can be solved by writing a script that generates the TChecker model and that handles process instantiation smoothly.',
		parameters: [
			{
				label: 'id',
				documentation: 'Process\'s identifier.'
			},
			{
				label: 'attributes',
				documentation: 'The {attributes} part of the declaration can be ommitted if no attribute is associated to the system (or it can be left empty: {}).'
			}
		],
		attributePos: 1
	},
	{
		name: 'event',
		signature: 'event:id{attributes}',
		documentation: 'Declares an event with identifier id and given attributes. No other event shall have the same identifier.',
		parameters: [
			{
				label: 'id',
				documentation: 'Event\'s identifier.'
			},
			{
				label: 'attributes',
				documentation: 'The {attributes} part of the declaration can be ommitted if no attribute is associated to the system (or it can be left empty: {}).'
			}
		],
		attributePos: 1
	},
	{
		name: 'clock',
		signature: 'clock:size:id{attributes}',
		documentation: 'Declares an array of size clocks with identifier id and given attributes. No other clock shall have the same identifier.',
		parameters: [
			{
				label: 'size',
				documentation: 'Size of the array.'
			},
			{
				label: 'id',
				documentation: 'Clock\'s identifier.'
			},
			{
				label: 'attributes',
				documentation: 'The {attributes} part of the declaration can be ommitted if no attribute is associated to the system (or it can be left empty: {}).'
			}
		],
		attributePos: 2
	},
	{
		name: 'int',
		signature: 'int:size:min:max:init:id{attributes}',
		documentation: 'Declares the array of size bounded integer variables with identifier id and given attributes. Each variable in the array takes values between min and max (both included) and initial value init. No other integer variable shall have the same identifier.',
		parameters: [
			{
				label: 'size',
				documentation: 'Size of the array.'
			},
			{
				label: 'min',
				documentation: 'Minimum value of the array.'
			},
			{
				label: 'max',
				documentation: 'Maximum value of the array.'
			},
			{
				label: 'init',
				documentation: 'Initial value of the array.'
			},
			{
				label: 'id',
				documentation: 'Array\'s identifier.'
			},
			{
				label: 'attributes',
				documentation: 'The {attributes} part of the declaration can be ommitted if no attribute is associated to the system (or it can be left empty: {}).'
			}
		],
		attributePos: 5
	},
	{
		name: 'location',
		signature: 'location:p:id{attributes}',
		documentation: 'Declares location with identifier id in process with identifier p, and given attributes. The process identifier p shall have been declared previously. No other location within process p shall have the same identifier id. It is perfectly valid that two locations in different processes have the same identifier.',
		parameters: [
			{
				label: 'p',
				documentation: 'Process\' identifier.'
			},
			{
				label: 'id',
				documentation: 'Location\'s identifier.'
			},
			{
				label: 'attributes',
				documentation: 'The {attributes} part of the declaration can be ommitted if no attribute is associated to the system (or it can be left empty: {}).'
			}
		],
		attributePos: 2
	},
	{
		name: 'edge',
		signature: 'edge:p:source:target:e{attributes}',
		documentation: 'Declares an edge in process p from location source to location target and labelled with event e. The process p shall have been declared previously. The two locations source and target shall have been declared as well, and they shall both belong to process p. The event e shall have been declared before the edge is declared.',
		parameters: [
			{
				label: 'p',
				documentation: 'Process\'s identifier.'
			},
			{
				label: 'source',
				documentation: 'Source location.'
			},
			{
				label: 'target',
				documentation: 'Target location.'
			},
			{
				label: 'e',
				documentation: 'Labelled event.'
			},
			{
				label: 'attributes',
				documentation: 'The {attributes} part of the declaration can be ommitted if no attribute is associated to the system (or it can be left empty: {}).'
			}
		],
		attributePos: 4
	},
	{
		name: 'sync',
		signature: 'sync:sync_constraints{attributes}',
		documentation: 'Declares a synchronisation constraint with given attributes. sync_constraints is a colon-separated list of synchronisation constraints of the form p@e or p@e? where p is a process name, e is an event name, and the option question mark ? denotes a weak synchronisation. Process p and event e shall have been declared before the synchronisation is declared.',
		parameters: [
			{
				label: 'sync_constraints',
				documentation: 'Synchronisation constraints.'
			},
			{
				label: 'attributes',
				documentation: 'The {attributes} part of the declaration can be ommitted if no attribute is associated to the system (or it can be left empty: {}).'
			}
		],
		attributePos: 1
	}
]
