declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string;
			CLIENT_ID: string;
			CLIENT_SECRET: string;
			SHEET_ID: string;
		}
	}
}


export { };