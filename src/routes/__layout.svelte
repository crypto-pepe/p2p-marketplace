<script lang="ts" context="module">
	import Footer from '$lib/components/footer/Footer.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import '../app.css';
</script>

<Header />
<main>
	<slot />
</main>

<Footer />

<style>
</style>
