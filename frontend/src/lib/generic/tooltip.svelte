<script>
	import { scale } from 'svelte/transition';

	export let text = '';
	export let show = false;
</script>

{#if text}
	<div class="tool-tippable">
		<div on:mouseenter={(e) => (show = true)} on:mouseleave={(e) => (show = false)}>
			<slot />
		</div>

		{#if show}
			<div
				in:scale|local={{ duration: 200 }}
				out:scale|local={{ duration: 200 }}
				class="tooltip">
				{text}
			</div>
		{/if}
	</div>
{:else}
	<slot />
{/if}

<style lang="postcss">
	.tool-tippable {
		@apply relative inline-block cursor-pointer select-none align-middle;
	}

	.tooltip {
		@apply absolute left-1/2 z-30 mt-2 -translate-x-1/2 whitespace-pre;
		@apply rounded border border-neutral-600 bg-neutral-800 py-2 px-2 text-center text-xs;
	}
</style>
