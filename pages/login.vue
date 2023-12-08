<template>
	<div>
		<button @click="signIn('discord')">
			Se connecter
		</button>
	</div>
</template>
<script setup lang="ts">
definePageMeta({
	auth: {
		unauthenticatedOnly: true,
		navigateAuthenticatedTo: '/',
	},
	layout: 'empty',
});
const { signIn } = useAuth();
</script>
