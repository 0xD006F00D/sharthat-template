<script>
	import { fade } from 'svelte/transition';
	import { contracts } from 'svelte-ethers-store';
	import { ReadConnected, ReadContracts } from '$lib/stores/evm';

	import Address from '$lib/generic/address.svelte';
	import Contract from '$lib/generic/contract.svelte';
	import Panel from '$lib/generic/panel.svelte';
</script>

<div class="contracts" in:fade={{ duration: 400 }}>
	{#if $ReadConnected}
		<div class="panel-container" in:fade={{ duration: 400 }}>
			{#each Object.entries($ReadContracts) as [name, contract] (name)}
				<Panel {name}>
					<Address slot="header" value={contract.address} />
					<Contract
						readContract={$ReadContracts[name]}
						writeContract={$contracts[name]} />
				</Panel>
			{/each}
		</div>
	{:else}
		<h1>No contracts loaded</h1>
	{/if}
</div>

<style lang="postcss">
	.contracts {
		@apply m-auto max-w-2xl break-words py-16 px-4 text-center;
	}
</style>
