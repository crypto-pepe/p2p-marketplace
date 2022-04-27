<script lang="ts" context="module">
	import { page } from '$app/stores';
</script>

<script lang="ts">
	export let link: {
		content: string;
		href: string;
	};

	function isLocal(href: string): boolean {
		const regexp = /^\//;
		return regexp.test(href);
	}
</script>

<li class="nav__list-item" class:active={$page.url.pathname === link.href}>
	{#if isLocal(link.href)}
		<a class="nav__list-item-link" href={link.href}>
			{link.content}
		</a>
	{:else}
		<a
			class="nav__list-item-link"
			href={link.href}
			target="_blank"
			referrerpolicy="noopener noreferrer"
		>
			{link.content}
		</a>
	{/if}
</li>
