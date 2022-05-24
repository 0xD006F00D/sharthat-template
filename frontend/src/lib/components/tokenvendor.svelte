<script>
	import { ethers } from 'ethers';
	import { connected, contracts, signerAddress } from 'svelte-ethers-store';

	import { ReadConnected, ReadContracts, ReadProvider } from '$lib/stores/evm';
	import { NativeBalance, Notifier, TokenBalance } from '$lib/stores';
	import { Transacting, tx } from '$lib/stores/transactor';
	import { Signature } from '$lib/common/signature';

	import Divider from '$lib/generic/divider.svelte';

	let amountToBuy = '';
	let amountToSell = '';
	let amountToWithdraw = '';

	let signature = new Signature();

	let moniesPerEth = 0;
	let vendorOwner;

	$: if ($ReadConnected) initialize();

	async function initialize() {
		moniesPerEth = await $ReadContracts.TokenVendor.moniesPerEth();
		vendorOwner = await $ReadContracts.TokenVendor.owner();
	}

	async function buy() {
		const tokenAmount = ethers.utils.parseEther(amountToBuy);
		const amountInEth = tokenAmount.div(moniesPerEth);

		if (amountInEth.gt($NativeBalance.value)) {
			Notifier.danger('Not enough Ether');
			return;
		}

		const txSuccess = await tx($contracts.TokenVendor.buy, {
			value: amountInEth
		});

		if (txSuccess) {
			Notifier.success('Exchange succeeded');
		}

		NativeBalance.refresh();
		TokenBalance.refresh();
	}

	async function permit() {
		let tokenAmount = ethers.utils.parseEther(amountToSell);

		if (tokenAmount.gt($TokenBalance.value)) {
			Notifier.danger('Not enough Money');
			return;
		}

		await signature.create($contracts.Money, $contracts.TokenVendor.address, tokenAmount);
	}

	async function sell() {
		if (!signature.value) {
			Notifier.danger('Signature Invalid');
			return;
		}

		let tokenAmount = ethers.utils.parseEther(amountToSell);

		const txSuccess = await tx(
			$contracts.TokenVendor.sellWithPermit,
			tokenAmount,
			signature.deadline,
			signature.split.v,
			signature.split.r,
			signature.split.s
		);

		if (txSuccess) {
			Notifier.success('Exchange succeeded');
		}

		signature = signature.reset();
		NativeBalance.refresh();
		TokenBalance.refresh();
	}

	async function getAllEth() {
		let contractBalance = await $ReadProvider.getBalance($ReadContracts.TokenVendor.address);

		amountToWithdraw = ethers.utils.formatEther(contractBalance);
	}

	async function withdraw() {
		const ethAmount = ethers.utils.parseEther(amountToWithdraw);

		const txSuccess = await tx($contracts.TokenVendor.withdraw, ethAmount);

		if (txSuccess) {
			Notifier.success('Withdrawal succeeded');
		}

		NativeBalance.refresh();
	}
</script>

<div class="space-y-4">
	<h1>Balance</h1>

	<div>
		{$NativeBalance.display} ${$NativeBalance.symbol} / {$TokenBalance.display} ${$TokenBalance.symbol}
	</div>

	<Divider />

	<h1>Buy</h1>

	<input
		class="w-full text-center"
		placeholder="$MNY Amount"
		disabled={!$connected}
		bind:value={amountToBuy} />

	<button
		class="w-full"
		disabled={!$connected || $Transacting || !amountToBuy.length}
		on:click={buy}>Buy</button>

	<Divider />

	<h1>Sell</h1>

	<input
		class="w-full text-center"
		placeholder="$MNY Amount"
		disabled={!$connected}
		bind:value={amountToSell} />

	<div class="flex space-x-2">
		<button
			class="w-full"
			disabled={!$connected || $Transacting || !amountToSell.length || signature.value}
			on:click={permit}>Permit</button>
		<button
			class="w-full"
			disabled={!$connected || $Transacting || !signature.value}
			on:click={sell}>Sell</button>
	</div>

	{#if $connected && $signerAddress === vendorOwner}
		<Divider />

		<h1>Withdraw</h1>

		<div class="flex space-x-2">
			<input
				class="w-full text-center"
				placeholder="$ETH Amount"
				disabled={!$connected}
				bind:value={amountToWithdraw} />
			<button
				class="flex-shrink-0"
				disabled={!$connected || $Transacting}
				on:click={() => getAllEth()}>All</button>
		</div>

		<button
			class="w-full"
			disabled={!$connected || $Transacting || !amountToWithdraw.length}
			on:click={withdraw}>Withdraw</button>
	{/if}
</div>

<style lang="postcss">
</style>
