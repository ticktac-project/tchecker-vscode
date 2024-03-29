/**
 * This module integrates the 'tck-reach' and 'tck-liveness' tool in the extension.
 * 
 * handleTckReachLiveness is a shortcut for displaying the task selector.
 * 
 * This module relies on:
 *   - tckCommon.ts in order to create the status bar;
 *   - constants.ts in order to get all needed constants.
 * 
 * All customizable displayed text can be founded in constants.ts.
 */

import { createTckStatusBarItem } from './tckCommon';
import { tckReachLivenessStatusBarText } from '../constants';

// creates tck-reach / tck-liveness status bar
export const tckReachLivenessStatusBar = createTckStatusBarItem('workbench.action.tasks.runTask', tckReachLivenessStatusBarText, 30);

/**
 * Creates a status bar item that triggers the task selector.
 * 
 * @returns A status bar item that triggers the task selector
 */
export function handleTckReachLiveness() {
	return [
		tckReachLivenessStatusBar
	];
}
