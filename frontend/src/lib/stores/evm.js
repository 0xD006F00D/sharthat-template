import { makeEvmStores } from 'svelte-ethers-store';

import { ContractsABI } from '$lib/common/constants';
import { Settings } from '$lib/stores/settings';

// Evm store connected to read-only provider
export const ReadEvmStores = makeEvmStores('read');

// ReadEvmStore's derived stores that can be directly subscribed to
export const ReadConnected = ReadEvmStores.connected;
export const ReadProvider = ReadEvmStores.provider;
export const ReadChainId = ReadEvmStores.chainId;
export const ReadContracts = ReadEvmStores.contracts;
export const ReadChainData = ReadEvmStores.chainData;

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

export function contractsDeployed(chainId) {
	return ContractsABI[chainId] !== undefined;
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
