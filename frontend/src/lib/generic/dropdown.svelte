<script>
	import { slide } from 'svelte/transition';

	export let show = false;
</script>

<div class:open={show} class="dropdown">
	<div>
		<slot name="static" />
	</div>
	<div
		on:mouseenter={(e) => (show = true)}
		on:mouseleave={(e) => (show = false)}
		on:click|stopPropagation={() => (show = !show)}>
		<slot />
		{#if show}
			<ul class="dropdown-content" transition:slide|local={{ y: 30, duration: 200 }}>
				<slot name="items" />
			</ul>
		{/if}
	</div>
</div>

<style lang="postcss">
	.dropdown {
		@apply relative inline-flex cursor-pointer select-none;
	}

	.dropdown-content {
		@apply absolute left-0 z-30 max-h-[80vh] w-full overflow-y-auto rounded-b text-left;
	}

	:global(.dropdown-item),
	:global(.dropdown-link a) {
		@apply truncate py-4 px-3;
	}

	:global(.dropdown-link a) {
		@apply block border-0 text-white;
	}

	:global(.dropdown-content > *) {
		@apply bg-neutral-800;
	}

	:global(.dropdown-content > *:hover) {
		@apply bg-neutral-600;
	}

	:global(.dropdown-content > *:last-of-type) {
		@apply rounded-b;
	}
</style>
