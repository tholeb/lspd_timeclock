import type { Sequelize } from 'sequelize';

declare module '#app' {
	interface NuxtApp {
		$db: Sequelize
	}
}

declare module 'vue' {
	interface ComponentCustomProperties {
		$db: Sequelize
	}
}

export { };