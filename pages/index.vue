<script setup lang="ts">
const route = useRoute()

const ui = /*ui*/ {
  background: 'bg-white dark:bg-slate-900'
}
</script>

<template>
	<div>
		<h1>Nuxt Routing set up successfully!</h1>
		<p>Current route: {{ route.path }}</p>
		<a href="https://nuxt.com/docs/getting-started/routing" target="_blank">Learn more about Nuxt Routing</a>
	</div>
	<UCard :ui="ui" />
</template>
