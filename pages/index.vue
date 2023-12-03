<script setup lang="ts">
const route = useRoute();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ui = {
	background: 'bg-white dark:bg-slate-900',
};

const { data, status, getCsrfToken, getProviders } = useAuth();

const providers = await getProviders();
const csrfToken = await getCsrfToken();
</script>

<template>
	<div>
		<h1>Nuxt Routing set up successfully!</h1>
		<p>Current route: {{ route.path }}</p>
		<a
			href="https://nuxt.com/docs/getting-started/routing"
			target="_blank"
		>Learn more about Nuxt Routing</a>
		<pre v-if="status"><span>Status:</span> {{ status }}</pre>
		<pre v-if="data"><span>Data:</span> {{ data }}</pre>
		<pre v-if="csrfToken"><span>CSRF Token:</span> {{ csrfToken }}</pre>
		<pre v-if="providers"><span>Providers:</span> {{ providers }}</pre>
	</div>
</template>

<style scoped>
pre {
  @apply bg-gray-800 text-white p-3 my-3 rounded shadow overflow-x-auto;
}

pre span {
  @apply text-green-400;
}
</style>