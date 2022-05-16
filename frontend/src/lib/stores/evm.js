import { derived } from 'svelte/store';
import { makeEvmStores } from 'svelte-ethers-store';

import { ContractsABI } from '$lib/common/constants';
import { Settings } from '$lib/stores/settings';

//Evm store connected to read-only providers
export const ReadEvmStores = makeEvmStores('read');

export const ProviderConnected = derived(
	[ReadEvmStores.connected, ReadEvmStores.chainId, ReadEvmStores.contracts],
	async ([$connected, $chainId, $contracts], set) => {
		let value =
			$connected === true &&
			$chainId > 0 &&
			Object.keys($contracts).length ==
				Object.keys(ContractsABI[$chainId][0].contracts).length;

		set(value);
	},
	false
);

export function contractsDeployed(chainId) {
	return ContractsABI[chainId] !== undefined;
}

export function chainSupported(chainId, settings) {
	settings = settings ?? get(Settings);
	chainId = parseInt(chainId) ?? ReadEvmStores.$chainId;
	let network = settings.networks.find((n) => n.enabled && n.chainId == chainId);
	return network !== undefined && contractsDeployed(chainId);
}

export function getAvailableNetworks(settings) {
	settings = settings ?? get(Settings);
	return (
		(settings &&
			settings.networks.filter(
				(n) =>
					n.enabled &&
					(settings.useTestnets || !n.testnet) &&
					contractsDeployed(n.chainId)
			)) ||
		[]
	);
}

export async function loadAppContracts(evmStores, chainId, signerIfAvailable = true) {
	if (!chainId) return;
	let promises = [];
	for (const [name, contract] of Object.entries(ContractsABI[parseInt(chainId)][0].contracts)) {
		promises.push(
			evmStores.attachContract(name, contract.address, contract.abi, signerIfAvailable)
		);
	}
	await Promise.all(promises);
}
