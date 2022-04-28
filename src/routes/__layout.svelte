<script lang="ts" context="module">
	import Footer from '$lib/footer/Footer.svelte';
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<Header />
<main>
	<slot />
</main>

<Footer />

<style>
</style>
