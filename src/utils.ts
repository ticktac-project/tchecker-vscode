export function countCar(s: string, c: string) : number {
	let cnt = -1;
	for (let idx = 0; idx !== -1; idx=s.indexOf(c,idx+1)) {
		cnt++;
	}
	return cnt;
}
