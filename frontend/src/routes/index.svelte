<script>
	import { fade } from 'svelte/transition';
	import TokenVendor from '$lib/components/tokenvendor.svelte';
</script>

<div class="content" in:fade={{ duration: 400 }}>
	<section class="box">
		<TokenVendor />
	</section>
</div>

<style lang="postcss">
	.content {
		@apply flex flex-wrap items-start justify-center text-center;
	}

	.box {
		@apply mx-4 my-8 w-[95%] max-w-sm overflow-hidden border-4 border-neutral-800 p-8;
	}
</style>
