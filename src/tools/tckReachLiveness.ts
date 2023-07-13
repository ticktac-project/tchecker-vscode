import { displayStatusBar } from './tckCommon'; 

export function handleTckReachLiveness() {
	return [ displayStatusBar('workbench.action.tasks.runTask', 'Model Checking', 30)];
}
