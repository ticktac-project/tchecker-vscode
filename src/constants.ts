import * as vscode from 'vscode';

export type Keyword = {
	name: string,
	signature: string,
	documentation: string,
	parameters: vscode.ParameterInformation[],
	attributePos: number
}

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
				documentation: 'Optional.'
			}
		],
		attributePos: 1
	},
	{
		name: 'process',
		signature: 'process:id{attributes}',
		documentation: 'Declares a process with identifier id and given attributes. No other process shall have the same identifier.',
		parameters: [
			{
				label: 'id',
				documentation: 'Process\'s identifier.'
			},
			{
				label: 'attributes',
				documentation: 'Optional.'
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
				documentation: 'Optional.'
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
				documentation: '...'
			},
			{
				label: 'id',
				documentation: 'System\'s identifier.'
			},
			{
				label: 'attributes',
				documentation: 'Optional.'
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
				documentation: '...'
			},
			{
				label: 'min',
				documentation: '...'
			},
			{
				label: 'max',
				documentation: '...'
			},
			{
				label: 'init',
				documentation: '...'
			},
			{
				label: 'id',
				documentation: 'Int\'s identifier.'
			},
			{
				label: 'attributes',
				documentation: 'Optional.'
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
				documentation: '...'
			},
			{
				label: 'id',
				documentation: 'System\'s identifier.'
			},
			{
				label: 'attributes',
				documentation: 'Optional.'
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
				documentation: '...'
			},
			{
				label: 'source',
				documentation: '...'
			},
			{
				label: 'target',
				documentation: '...'
			},
			{
				label: 'e',
				documentation: '...'
			},
			{
				label: 'attributes',
				documentation: 'Optional.'
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
				documentation: '...'
			},
			{
				label: 'attributes',
				documentation: 'Optional.'
			}
		],
		attributePos: 1
	}
]
