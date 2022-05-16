import { writable } from 'svelte/store';
import { defaultEvmStores } from 'svelte-ethers-store';

import { Notifier } from '$lib/stores';

function createTransactingStore() {
	const state = writable(false);
	let notificationId;

	function start(message) {
		if (notificationId) {
			stop();
		}
		notificationId = Notifier.wait(message);
		state.set(true);
		return true;
	}

	function stop() {
		Notifier.done(notificationId);
		notificationId = null;
		state.set(false);
	}

	return {
		subscribe: state.subscribe,
		start: (message = 'Transacting') => start(message),
		stop: () => stop()
	};
}

export const Transacting = createTransactingStore();

export async function txPromise(promise) {
	let receipt;
	let tx;
	try {
		Transacting.start();
		tx = await promise;
		receipt = await defaultEvmStores.$provider.waitForTransaction(tx.hash);
	} catch (e) {
		Transacting.stop();
		Notifier.danger(e);
		return tx;
	}
	Transacting.stop();
	return receipt;
}

export async function tx(func, ...params) {
	let receipt;
	let tx;
	let success = false;

	try {
		Transacting.start();
		tx = await func(...params);
		receipt = await defaultEvmStores.$provider.waitForTransaction(tx.hash);
		success = true;
	} catch (e) {
		Notifier.danger(e);
	}

	Transacting.stop();
	return success;
}

export async function query(func, ...params) {
	let result = null;
	Transacting.start();
	try {
		result = await func(...params);
	} catch (e) {
		Notifier.danger(e);
	}
	Transacting.stop();
	return result;
}
