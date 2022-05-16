<script>
	import { page } from '$app/stores';
	import { Settings } from '$lib/stores';

	console.log($page.error);
</script>

<div class="m-auto my-32 max-w-screen-2xl space-y-6 break-words px-8 text-center">
	<h1>ERROR {$page.status}</h1>

	<h3>{$page.error.message}</h3>

	{#if $Settings.debug == true}
		<div
			class="inline-block w-auto max-w-[90vw] border-2 border-neutral-500 bg-neutral-800 p-4 text-left text-xs">
			<pre class="whitespace-pre-wrap">{$page.error.stack}</pre>
		</div>
	{/if}
</div>

<style lang="postcss">
</style>
