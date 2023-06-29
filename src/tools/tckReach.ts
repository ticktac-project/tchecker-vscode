import { displayStatusBar } from './tckCommon'; 

export function handleTckReach() {
	return [ displayStatusBar('workbench.action.tasks.runTask', 'Launch tck-reach', 30)];
}
