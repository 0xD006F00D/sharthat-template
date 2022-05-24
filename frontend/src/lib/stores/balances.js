import { derived, writable } from 'svelte/store';
import { ethers } from 'ethers';
import { connected, signer, chainId, chainData, signerAddress } from 'svelte-ethers-store';

import { ReadEvmStores } from '$lib/stores/evm';
import { getDisplayValue } from '$lib/common/helper';

function createNativeBalanceStore() {
	const refreshStore = writable(true);
	const defaultValue = ethers.BigNumber.from(0);
	const defaultSymbol = 'ETH';

	const symbolStore = derived([chainData, chainId], ([$chainData, $chainId], set) => {
		let value = defaultSymbol;
		if ($chainData.shortName && $chainId != 31337) {
			value = $chainData.shortName.toUpperCase();
		}
		set(value);
	});

	const valueStore = derived(
		[connected, signer, refreshStore],
		async ([$connected, $signer], set) => {
			if ($connected && $signer) {
				let value = await $signer.getBalance();
				set(value);
				console.log('Loaded Native Balance');
			}
		},
		defaultValue
	);

	const store = derived(
		[valueStore, symbolStore],
		([$valueStore, $symbolStore], set) => {
			set({
				value: $valueStore,
				display: getDisplayValue($valueStore),
				symbol: $symbolStore
			});
		},
		{ value: defaultValue, display: 0, symbol: defaultSymbol }
	);

	return {
		subscribe: store.subscribe,
		refresh: () => refreshStore.update((b) => !b)
	};
}

function createTokenBalanceStore() {
	const refreshIntervalTime = 60000;
	let refreshInterval;

	const refreshStore = writable(true);
	const defaultValue = ethers.BigNumber.from(0);
	const defaultSymbol = '';

	const symbolStore = derived(
		[ReadEvmStores.$connected],
		async ([$ReadConnected], set) => {
			if ($ReadConnected) {
				let value = await ReadEvmStores.$contracts.Money.symbol();
				set(value);
			}
		},
		defaultSymbol
	);

	const valueStore = derived(
		[connected, signerAddress, refreshStore],
		async ([$connected, $signerAddress], set) => {
			if ($connected && $signerAddress) {
				if (!refreshInterval) {
					refreshInterval = setInterval(() => {
						refresh();
					}, refreshIntervalTime);
				}

				let value = await ReadEvmStores.$contracts.Money.balanceOf($signerAddress);
				set(value);
				console.log('Loaded Token Balance');
			}

			return () => {
				clearInterval(refreshInterval);
				console.log('Unsubscribed from Token Balance');
			};
		},
		defaultValue
	);

	const store = derived(
		[valueStore, symbolStore],
		([$valueStore, $symbolStore], set) => {
			set({
				value: $valueStore,
				display: getDisplayValue($valueStore),
				symbol: $symbolStore
			});
		},
		{ value: defaultValue, display: 0, symbol: defaultSymbol }
	);

	function refresh() {
		refreshStore.update((b) => !b);
	}

	return {
		subscribe: store.subscribe,
		refresh: () => refresh()
	};
}

export const NativeBalance = createNativeBalanceStore();
export const TokenBalance = createTokenBalanceStore();
