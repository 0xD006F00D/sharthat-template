<script>
	import { ethers } from 'ethers';
	import { isEnsAddress } from '$lib/common/helper';

	const empty = 'FFF';

	export let address;
	export let validAddress = true;
	export let input = false;

	$: color = getColor(address);

	function getColorValue(addr) {
		return addr.substring(addr.length - 6);
	}

	function getColor(addr) {
		if (!addr) {
			return empty;
		}
		validAddress = true;

		if (isEnsAddress(addr)) {
			return getColorValue(ethers.utils.id(addr));
		}

		if (ethers.utils.isAddress(addr)) {
			return getColorValue(addr);
		}

		validAddress = false;
		return empty;
	}
</script>

{#if input}
	<div class="address-identicon">
		<span class="absolute ml-2">
			{#if validAddress}
				<div style:background-color="#{color}" class="default" />
			{:else}
				<div class="default error" />
			{/if}
		</span>

		<slot />
	</div>
{:else if validAddress}
	<div style:background-color="#{color}" class="default" />
{:else}
	<div class="default error" />
{/if}

<style lang="postcss">
	.address-identicon {
		@apply relative flex items-center;
	}

	.address-identicon :global(input) {
		@apply w-full pl-6;
	}

	.default {
		@apply mr-2 h-3 w-3 rounded-full;
	}

	.error {
		@apply border-2 border-red-600;
	}
</style>
