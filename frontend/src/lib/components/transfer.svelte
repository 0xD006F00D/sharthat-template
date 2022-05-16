<script>
	import { createEventDispatcher } from 'svelte';
	import { ethers } from 'ethers';
	import { connected, contracts } from 'svelte-ethers-store';

	import { Transacting, tx } from '$lib/stores/transactor';
	import { TokenBalance, Notifier } from '$lib/stores';
	import { resolveAddress } from '$lib/common/helper';

	import Identicon from '$lib/generic/identicon.svelte';
	import Popup from '$lib/generic/popup.svelte';

	export let to = '';
	export let amount = '';
	export let show = false;

	const dispatch = createEventDispatcher();

	async function transfer() {
		if (!$connected) return;

		let resolvedAddress = await resolveAddress(to);

		if (!resolvedAddress) {
			Notifier.danger('Invalid Address');
			return;
		}

		if (isNaN(amount) || amount < 0) {
			Notifier.danger('Invalid Amount');
			return;
		}

		let amountInWei = ethers.utils.parseEther(amount);
		const txSuccess = await tx(
			$contracts.CounterfeitMoney.transfer,
			resolvedAddress,
			ethers.utils.hexlify(amountInWei)
		);

		if (txSuccess) {
			TokenBalance.refresh();

			Notifier.success('Transfer was successful');

			show = false;
			dispatch('done');
		}
	}
</script>

<Popup bind:show>
	<h1 class="mb-4">Transfer ${$TokenBalance.symbol}</h1>

	<div class="space-y-4">
		<Identicon input bind:address={to}>
			<input id="transferToAddressInput" placeholder="0xAddress" bind:value={to} />
		</Identicon>

		<div class="relative flex items-center">
			<span class="absolute ml-2 -mt-[2px]">$</span>

			<input
				id="transferAmountInput"
				class="w-full pl-6"
				name="0xValue"
				placeholder="Amount"
				bind:value={amount} />
		</div>

		<div class="flex items-center space-x-4">
			<button
				id="transferButton"
				class="danger flex-1"
				disabled={!$connected || $Transacting}
				on:click={transfer}>Transfer</button>
			<button id="transferCancelButton" on:click|stopPropagation={(e) => (show = false)}
				>Cancel</button>
		</div>
	</div>
</Popup>

<style lang="postcss">
</style>
