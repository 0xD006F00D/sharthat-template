<script>
	import { slide } from 'svelte/transition';

	export let name = '';
	export let open = false;
</script>

<div class="panel">
	<div
		id="panelHeader{name}"
		class:open
		class="header arrow-{open ? 'up' : 'down'}"
		on:click={() => (open = !open)}>
		<h2>{name}</h2>
		<span class="ml-auto">
			<slot name="header" />
		</span>
	</div>

	{#if open}
		<div class="content" transition:slide|local>
			<slot />
		</div>
	{/if}
</div>

<style lang="postcss">
	:global(.panel-container) {
		@apply rounded border border-neutral-600 text-left;
	}

	.header {
		@apply relative flex w-full cursor-pointer items-center border-b border-neutral-600 p-4 pr-14 text-left;
	}

	.header:after {
		@apply right-6;
	}

	.content {
		@apply border-b border-neutral-600 p-2;
	}

	.panel:last-child .content,
	.panel:last-child .header:not(.open) {
		@apply border-b-0;
	}
</style>
