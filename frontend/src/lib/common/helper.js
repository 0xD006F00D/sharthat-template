import { ethers } from 'ethers';

import { ReadEvmStores } from '$lib/stores/evm';
import { Notifier } from '$lib/stores';
import { Transacting } from '$lib/stores/transactor';

export function isEnsAddress(address) {
	return /^(.+)\.\w+$/.test(address);
}

export async function resolveAddress(address) {
	if (isEnsAddress(address)) {
		Transacting.start('Resolving Name');
		let resolvedAddress = await ReadEvmStores.$provider.resolveName(address);
		Transacting.stop();

		if (ethers.utils.isAddress(resolvedAddress)) {
			return resolvedAddress;
		}
	}

	if (ethers.utils.isAddress(address)) {
		return address;
	}

	return null;
}

export function getDisplayValue(value) {
	return value ? parseFloat(ethers.utils.formatEther(value)).toFixed(2) : '0.00';
}

export function isValidHttpUrl(string) {
	let url;
	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}
	return url.protocol === 'http:' || url.protocol === 'https:';
}

export function getTimestamp() {
	return Math.ceil(new Date().getTime() / 1000);
}

export function copyToClipboard(text, thing) {
	thing = thing ? thing + ' ' : '';
	try {
		navigator.clipboard.writeText(text);
		Notifier.info('Copied ' + thing + 'to clipboard');
	} catch (e) {
		console.log('Copied to Clipboard', text);
		Notifier.danger('Could not copy ' + thing + 'to clipboard');
	}
}
