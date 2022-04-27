<script lang="ts" context="module">
	import NavBar from './navbar/NavBar.svelte';
</script>

<script lang="ts">
	const navLinks: {
		content: string;
		href: string;
	}[] = [
		{
			content: 'Marketplace',
			href: '/'
		},
		{
			content: 'Account',
			href: '/account'

		},
		{
			content: 'Exchanges',
			href: '/exchanges'
		},
		{
			content: 'Stats',
			href: '/stats'
		},
		{
			content: 'FAQ',
			href: 'https://pepe-team.tawk.help/'
		}
	];

	//get value from store
	let isConnected: boolean = false;
</script>

<header class="header">
	<div class="header__logo">Logo</div>
	<NavBar {isConnected} {navLinks} />
	<div class="header__button">
		<button>Connect</button>
	</div>
</header>

<style>
</style>
