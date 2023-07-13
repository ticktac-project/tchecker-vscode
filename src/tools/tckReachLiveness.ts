import { displayStatusBar } from './tckCommon';
import { tckReachLivenessStatusBarText } from '../constants';

export function handleTckReachLiveness() {
	return [ displayStatusBar('workbench.action.tasks.runTask', tckReachLivenessStatusBarText, 30)];
}
