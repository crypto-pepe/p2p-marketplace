<script lang="ts" context="module">
	import { page } from '$app/stores';
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
	<nav class="header__nav">
		<ul class="header__nav-list">
			{#each navLinks as link}
				{#if isConnected}
					<li class="header__nav-list" class:active={$page.url.pathname === link.href}>
						<a href={link.href}>{link.content}</a>
					</li>
				{:else if link.href !== '/account' && link.href !== '/exchanges'}
					<li class="header__nav-list" class:active={$page.url.pathname === link.href}>
						<a href={link.href}>{link.content}</a>
					</li>
				{/if}
			{/each}
		</ul>
	</nav>
	<div class="header__button">
		<button>Connect</button>
	</div>
</header>

<style>
</style>
