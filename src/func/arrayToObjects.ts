import { GenericObject } from '~/types/ISheet';

export default function transformArrayToObject<T extends GenericObject>(
	array: string[][],
	keys: (keyof T)[],
): T[] {
	return array.map(subArray => {
		const obj: T = {} as T;
		keys.forEach((key, index) => {
			obj[key] = subArray[index] as T[keyof T];
		});
		return obj;
	});
}