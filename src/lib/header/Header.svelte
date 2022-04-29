<script lang="ts" context="module">
	import type { Link } from 'src/types';
	import NavBar from './navbar/NavBar.svelte';

	const navLinks: Link[] = [
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
			href: 'https://pepe-team.tawk.help/',
			target: '_blank',
			referrerpolicy: 'noopener noreferrer'
		}
	];
</script>

<script lang="ts">
	//get value from store
	let isConnected: boolean = false;

	const getVisibleLinks = (): Link[] => {
		return navLinks.filter((link) =>
			isConnected ? link : link.href !== '/account' && link.href !== '/exchanges'
		);
	};
</script>

<header class="header">
	<div class="header__logo">Logo</div>
	<NavBar navLinks={getVisibleLinks()} />
	<div class="header__button">
		<button>Connect</button>
	</div>
</header>

<style>
</style>
