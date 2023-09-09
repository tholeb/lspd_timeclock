export interface IEmploye extends GenericObject {
	userid: string;
	identity: string;
	phone: string;
	bankAccount: string;
	date: string;
}
export const employeKeys: (keyof IEmploye)[] = ['userid', 'identity', 'phone', 'bankAccount', 'date'];

export interface IVehicle extends GenericObject {
	plate: string;
	model: string;
}
export const vehicleKeys: (keyof IVehicle)[] = ['plate', 'model'];

export enum ServiceStatus {
	PRISE = 'prise',
	FIN = 'fin',
}

export interface IServices extends GenericObject {
	user: string;
	model: string;
	status: ServiceStatus;
}
export const serviceKeys: (keyof IVehicle)[] = ['user', 'plate', 'status', 'date'];

export type GenericObject = { [key: string]: string };