declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string;
			CLIENT_ID: string;
			CLIENT_SECRET: string;
			PORT: string;
			SESSION_SECRET: string;
		}
	}
}


export { };