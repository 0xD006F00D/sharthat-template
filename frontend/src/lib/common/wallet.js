import { ethers } from 'ethers';
import { defaultEvmStores, allChainsData } from 'svelte-ethers-store';

import { Notifier } from '$lib/stores';

export async function connectWallet() {
	try {
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

		if (accounts.length) {
			const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
			await defaultEvmStores.setProvider(web3Provider);
		}
	} catch (e) {
		console.log(e);
	}

	if (defaultEvmStores.$connected) {
		return true;
	}
	Notifier.danger('Could not connect to wallet RPC');
	return false;
}

export async function switchWalletToNetwork(chainId) {
	try {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: ethers.utils.hexValue(chainId) }]
		});
		return true;
	} catch (switchError) {
		// This error code indicates that the chain has not been added to MetaMask.
		if (switchError.code === 4902) {
			return await addNetworkToWallet(chainId);
		} else {
			Notifier.danger('Error: Could not switch to Network');
		}
	}

	return false;
}

export async function addNetworkToWallet(chainId) {
	try {
		//https://gitlab.com/clb1/svelte-ethers-store/-/blob/b0489c69cc6e525d85b037291131b2d88fba640c/src/chains.js
		let networkDetails = allChainsData.find((d) => d.chainId == chainId);
		await window.ethereum.request({
			method: 'wallet_addEthereumChain',
			params: [
				{
					chainId: '0x' + networkDetails.chainId.toString(16),
					chainName: networkDetails.name,
					nativeCurrency: networkDetails.nativeCurrency,
					rpcUrls: networkDetails.rpc,
					blockExplorerUrls: [networkDetails.explorers[0].url]
				}
			]
		});
		Notifier.success('Network added');
		return true;
	} catch (addError) {
		console.log(addError);
		Notifier.danger('Error: Please add the network manually');
	}

	return false;
}

export async function addTokenToWallet(chainId, tokenAddress, tokenSymbol, tokenDecimals = 18) {
	if (!chainId) {
		Notifier.danger('No network selected');
		return false;
	}

	try {
		let result = await window.ethereum.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20',
				options: {
					address: tokenAddress,
					symbol: tokenSymbol,
					decimals: tokenDecimals
					//image: 'https://foo.io/token-image.svg'
				}
			}
		});
		console.log(result);
		Notifier.success(`$${tokenSymbol} added to Wallet`);
		return true;
	} catch (addError) {
		console.log(addError);
	}

	Notifier.danger('Error: Please add the token manually');

	return false;
}
