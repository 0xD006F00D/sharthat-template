<script>
	import { fade } from 'svelte/transition';
</script>

<div class="content" in:fade={{ duration: 400 }}>
	<h1><a href="https://github.com/0xD006F00D/sharthat-template">Github</a></h1>

	<h2 class="mt-16">Created by <a href="https://twitter.com/0xD006F00D">@0xd006f00d</a></h2>
</div>

<style lang="postcss">
	.content {
		@apply m-auto my-16 max-w-2xl break-words px-4 text-center;
	}
</style>
