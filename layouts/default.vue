<script setup lang="ts">
const { data } = useAuth();

const user = data.value?.user;

const drawerPages = [
	{
		title: 'Accueil',
		icon: 'mdi-home',
		to: '/',
	},
	{
		title: 'Heures de services',
		icon: 'mdi-home',
		to: '/services/',
	},
	{
		title: 'Notes de frais',
		icon: 'mdi-home',
		to: '/',
		disabled: true,
	},
	{
		title: 'Véhicules',
		icon: 'mdi-home',
		to: '/',
		disabled: true,
	},
];

</script>

<template>
	<v-layout class="rounded rounded-md">
		<v-app-bar>
			<template #prepend>
				<v-app-bar-nav-icon />
			</template>

			<v-app-bar-title>LSPD Management et service</v-app-bar-title>

			<v-spacer />

			<v-btn icon>
				<v-icon>mdi-play</v-icon>
			</v-btn>

			<v-btn icon>
				<v-icon>mdi-cog</v-icon>
			</v-btn>

			<v-btn icon>
				<v-icon>mdi-account</v-icon>
			</v-btn>
		</v-app-bar>

		<v-navigation-drawer
			permanent
		>
			<template #prepend>
				<v-list-item
					v-if="user"
					lines="two"
					:prepend-avatar="user.image || ''"
					:title="user.name || ''"
				/>
			</template>

			<v-divider />

			<v-list
				nav
			>
				<v-list-item
					v-for="page in drawerPages"
					:key="page.title"

					:prepend-icon="page.icon"
					:title="page.title"
					:value="page.title"
					:href="page.to"
					:disabled="page.disabled || false"
				/>
			</v-list>
		</v-navigation-drawer>

		<v-main
			class="d-flex align-center justify-center"
			style="min-height: 300px;"
		>
			<slot />
		</v-main>

		<v-footer
			app
			name="footer"
		>
			dsqdq
		</v-footer>
	</v-layout>
</template>