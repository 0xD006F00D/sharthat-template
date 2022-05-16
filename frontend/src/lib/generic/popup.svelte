<script>
	import { fade } from 'svelte/transition';

	export let show = false;
	export let width = '550px';
	export let maxWidth = '80vw';
</script>

<svelte:head>
	{#if show}
		<style>
			body {
				overflow: hidden;
			}
		</style>
	{/if}
</svelte:head>

{#if show}
	<div
		style="--popup-width: {width}; --popup-max-width: {maxWidth};"
		class="popup-window"
		transition:fade|local={{ duration: 100 }}
		on:click={() => (show = false)}>
		<div class="popup-container" on:click|stopPropagation>
			<span class="icon-link " on:click={() => (show = false)}>❌</span>
			<slot />
		</div>
	</div>
{/if}

<style lang="postcss">
	.popup-window {
		@apply fixed inset-0 z-40 m-0 bg-black bg-opacity-30;
	}

	.popup-container {
		@apply relative top-[50%] m-auto -translate-y-1/2;
		@apply max-h-[95vh] min-h-[100px] w-[var(--popup-width)] max-w-[var(--popup-max-width)];
		@apply overflow-y-auto rounded border-4 border-neutral-800 bg-neutral-900 p-4;
	}

	.icon-link {
		@apply absolute right-4 top-4;
	}
</style>
