<script>
	import { ProviderConnected, ReadEvmStores } from '$lib/stores';
	import { connected } from 'svelte-ethers-store';

	// Initially undefined, refreshes with actual value on connect
	$: console.log('Connected', $connected);
	$: if ($connected) execute('Connected', $connected);

	// Initially undefined, subscription not working
	// Workaround via custom ProviderConnected store required
	$: console.log('ReadEvmStores.Connected', ReadEvmStores.$connected);
	$: if (ReadEvmStores.$connected) execute('ReadEvmStores.Connected', ReadEvmStores.$connected);

	// Initially default value, refreshes with actual value on connect
	$: console.log('ProviderConnected', $ProviderConnected);
	$: if ($ProviderConnected) execute('ProviderConnected', $ProviderConnected);

	function execute(name, value) {
		console.log('execute', name, value);
	}

	function logConnection() {
		console.log('ReadEvmStores.Connected', ReadEvmStores.$connected);
		console.log('ProviderConnected', $ProviderConnected);
	}
</script>

<div class="content">
	<h1>Open Console</h1>

	<button on:click={() => logConnection()}>logConnection</button>
</div>

<style lang="postcss">
	.content {
		@apply m-auto my-16 max-w-2xl break-words px-4 text-center;
	}
</style>
