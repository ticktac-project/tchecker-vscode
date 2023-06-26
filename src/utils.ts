export function countCar(s: string, c: string) : number {
	let cnt = 0;
	const n = s.length;
	let i = 0;
	while (i < n) {
		cnt += ((s[i] === c) ? 1 : 0)
		i++;
	}
	return cnt; 
}
