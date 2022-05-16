<script>
	import { onMount } from 'svelte';
	import {
		defaultEvmStores,
		signerAddress,
		connected,
		allChainsData
	} from 'svelte-ethers-store';

	import { copyToClipboard } from '$lib/common/helper';
	import { addTokenToWallet, connectWallet, switchWalletToNetwork } from '$lib/common/wallet';
	import { TokenBalance, Notifier, Settings } from '$lib/stores';
	import {
		ReadEvmStores,
		getAvailableNetworks,
		chainSupported,
		loadAppContracts
	} from '$lib/stores/evm';

	import Address from '$lib/generic/address.svelte';
	import Dropdown from '$lib/generic/dropdown.svelte';
	import Tooltip from '$lib/generic/tooltip.svelte';
	import Transfer from '$lib/components/transfer.svelte';
	import UserSettings from '$lib/components/usersettings.svelte';

	let isConnecting = false;

	let showNetworkMenu = false;
	let showAccountMenu = false;
	let showSettingsPopup = false;
	let showTransferPopup = false;

	let selectedChain;
	let selectedNetwork;
	$: availableNetworks = getAvailableNetworks($Settings);

	onMount(async () => {
		await initialize();
	});

	async function initialize() {
		let chainId = availableNetworks[0].chainId;
		if (
			window.ethereum &&
			window.ethereum.isConnected() &&
			chainSupported(window.ethereum, $Settings)
		) {
			chainId = window.ethereum.chainId;
		}
		await setNetwork(chainId, false);
		initNetworkEvents();
	}

	async function setNetwork(chainId, reset = false, autoConnect = false) {
		if (chainId == selectedChain || isConnecting) return;

		isConnecting = true;

		if (!chainSupported(chainId, $Settings)) {
			Notifier.danger('Chain not supported');
			isConnecting = false;
			return;
		}

		autoConnect = autoConnect || $connected;

		let notificationId = Notifier.wait('Connecting network');
		if (reset) await disconnect(true);

		await loadAppContracts(ReadEvmStores, chainId, false);
		await loadAppContracts(defaultEvmStores, chainId, true);

		selectedChain = chainId ? chainId : selectedChain;
		selectedNetwork = availableNetworks.find((n) => n.chainId == selectedChain);

		try {
			await ReadEvmStores.setProvider(selectedNetwork.rpcUrl);
		} catch (e) {
			Notifier.danger('RPC connection failed, check your settings');
		}

		console.log('setNetwork', selectedChain);
		Notifier.done(notificationId);

		isConnecting = false;
		if (autoConnect) await connect();
	}

	async function connect(chainId) {
		if (isConnecting) return;
		chainId = chainId || selectedChain;

		if (!window.ethereum) {
			Notifier.danger('No Wallet detected');
			return;
		}

		// Force page reload if metamask is installed but not initialized
		// e.g. after starting browser, opening site, but not yet entering password in MM
		// https://github.com/MetaMask/metamask-extension/issues/9407
		if (typeof window.ethereum !== 'undefined' && !window.ethereum._state.initialized) {
			window.location.reload();
		}

		if (!chainSupported(chainId, $Settings)) {
			Notifier.danger('Chain not supported');
			return;
		}

		let notificationId = Notifier.wait('Connecting account');
		let networkAvailable = true;
		isConnecting = true;

		if (chainId != window.ethereum.chainId) {
			networkAvailable = await switchWalletToNetwork(chainId);
		}

		if (networkAvailable) {
			await connectWallet();
		}

		isConnecting = false;
		Notifier.done(notificationId);
	}

	function initNetworkEvents() {
		if (window.ethereum) {
			window.ethereum.on('accountsChanged', async function () {
				await disconnect(false);
				await connect();
			});
			window.ethereum.on('chainChanged', async function (id) {
				await setNetwork(parseInt(id), true);
			});
		}
	}

	async function disconnect(reset = false) {
		console.log('disconnect', reset);
		if (reset) {
			await ReadEvmStores.disconnect();
		}

		await defaultEvmStores.disconnect();
	}

	function closePopups() {
		showNetworkMenu = false;
		showAccountMenu = false;
		showSettingsPopup = false;
		showTransferPopup = false;
	}
</script>

<div class="wallet space-y-4 align-middle md:mx-2 md:flex md:space-x-4 md:space-y-0">
	<!-- Networks -->
	<section class="order-2 inline-flex w-full text-center md:ml-4 md:w-auto">
		<Dropdown bind:show={showNetworkMenu}>
			<div class:active={showNetworkMenu} class="network-dropdown rounded-t py-2 px-4 ">
				{#if !selectedNetwork || !selectedNetwork.logo}
					<span class="icon-link text-2xl">🚫</span>
				{:else}
					<div
						class="mx-auto h-8 w-8 bg-contain bg-center bg-no-repeat"
						style="background-image:url({selectedNetwork.logo})" />
				{/if}
			</div>
			<svelte:fragment slot="items">
				{#each availableNetworks as n}
					<li
						title={n.name}
						class="network py-2"
						class:selected={n.chainId == selectedChain}
						on:click|stopPropagation={() => setNetwork(n.chainId, true)}>
						<div
							class="mx-auto mb-1 h-8 w-8 bg-contain bg-center bg-no-repeat"
							style="background-image:url({n.logo})" />
						<div
							class="break-word w-full overflow-hidden text-center text-[8px] leading-[9px]">
							{n.name}
						</div>
					</li>
				{/each}
			</svelte:fragment>
		</Dropdown>
	</section>

	<!-- Token Balance -->
	{#if $connected}
		<section class="inline-flex text-center">
			<Tooltip text="Refresh">
				<h3 class="mr-2 inline-block align-middle" on:click={TokenBalance.refresh}>
					${$TokenBalance.symbol}
				</h3>
			</Tooltip>
			<Tooltip text="Transfer">
				<h1 on:click|stopPropagation={(e) => (showTransferPopup = !showTransferPopup)}>
					{$TokenBalance.display}
				</h1>
			</Tooltip>
		</section>
	{/if}

	<!-- Connection & More -->
	<section class="order-3 block text-lg md:inline-flex">
		<Dropdown bind:show={showAccountMenu}>
			<svelte:fragment slot="static">
				{#if !$connected}
					<button
						class="split-button-left rounded-r-none border-r-0 px-12"
						class:rounded-b-none={showAccountMenu}
						id="accountConnectButton"
						disabled={isConnecting}
						on:click={() => connect()}>Connect</button>
				{/if}
			</svelte:fragment>
			{#if !$connected}
				<button class="split-button-right rounded-l-none"
					><span class="text-sm">▼</span></button>
			{:else}
				<Address
					tooltipText=""
					clickAction={() => (showAccountMenu = !showAccountMenu)}
					value={$signerAddress}
					status={true} />
			{/if}

			<svelte:fragment slot="items">
				{#if $connected}
					<li
						class="dropdown-item"
						on:click|stopPropagation={() => copyToClipboard($signerAddress)}>
						Copy Address
					</li>
				{/if}
				{#if selectedNetwork && selectedNetwork.testnet && selectedNetwork.chainId != 31337}
					<li class="dropdown-link">
						<a
							target="_blank"
							href={allChainsData.find((d) => d.chainId == selectedChain).faucets[0]}
							>Faucet
						</a>
					</li>
				{/if}
				<li
					class="dropdown-item"
					on:click|stopPropagation={() =>
						addTokenToWallet(
							selectedChain,
							ReadEvmStores.$contracts.Money.address,
							$TokenBalance.symbol
						)}>
					Add $MNY
				</li>
				<li
					class="dropdown-item"
					on:click|stopPropagation={() => (showSettingsPopup = !showSettingsPopup)}>
					Settings
				</li>
				{#if $connected}
					<li class="dropdown-item" on:click|stopPropagation={() => disconnect(false)}>
						Disconnect
					</li>
				{/if}
			</svelte:fragment>
		</Dropdown>
	</section>
</div>

<!-- Popups -->
<svelte:window on:click={closePopups} />
<UserSettings bind:show={showSettingsPopup} />
<Transfer bind:show={showTransferPopup} />

<style lang="postcss">
	section {
		@apply items-center justify-center;
	}

	.network-dropdown.active {
		@apply bg-neutral-800;
	}

	.network.selected {
		@apply bg-gray-700;
	}
</style>
