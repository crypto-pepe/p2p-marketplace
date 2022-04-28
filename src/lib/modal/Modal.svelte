<script lang="ts">
	export let isClosable: boolean = true;
	export let isCloseByEsc: boolean = true;

	let visible: boolean = false;

	export function openModal() {
		visible = true;
	}

	export function closeModal() {
		visible = false;
	}
	function handleKeyEsc(event: any) {
		if (event.key === 'Escape' && isCloseByEsc) {
			visible = false;
		}
	}
</script>

<svelte:window on:keyup={handleKeyEsc} />

{#if visible}
	<div class="modal" on:click|self={closeModal}>
		<div class="modal__window">
			{#if isClosable}
				<button class="modal__window-close-btn" on:click={closeModal}>Modal close</button>
			{/if}
			<div class="modal__window-title">
				<slot name="title" />
			</div>
			<div class="modal__window-content">
				<slot name="content" />
			</div>
		</div>
	</div>
{/if}

<style> </style>
