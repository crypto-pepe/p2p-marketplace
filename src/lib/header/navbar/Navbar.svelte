<script lang="ts" context="module">
  import NavLinkItem from './NavLinkItem.svelte';
</script>

<script lang="ts">

	export let isConnected: boolean = false;
	export let navLinks: {
		content: string;
		href: string;
	}[] = [];
</script>

<nav class="nav">
	<ul class="nav__list">
		{#each navLinks as link}
			{#if isConnected}
				<NavLinkItem {link} />
			{:else if link.href !== '/account' && link.href !== '/exchanges'}
				<NavLinkItem {link} />
			{/if}
		{/each}
	</ul>
</nav>
