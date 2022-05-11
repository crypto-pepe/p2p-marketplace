<script lang="ts" context="module">
	import type { Link } from '$lib/types';
	import { page } from '$app/stores';
</script>

<script lang="ts">
	export let navLinks: Link[] = [];
</script>

<nav class="nav">
	<ul class="nav__list">
		{#each navLinks as link}
			<li class="nav__list-item" class:active={$page.url.pathname === link.href}>
				<a
					class="nav__list-item-link"
					href={link.href}
					target={link.target}
					referrerpolicy={link.referrerpolicy}
				>
					{link.content}
				</a>
			</li>
		{/each}
	</ul>
</nav>
