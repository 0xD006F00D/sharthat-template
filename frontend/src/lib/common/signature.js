import { ethers } from 'ethers';
import { defaultEvmStores } from 'svelte-ethers-store';

import { Notifier } from '$lib/stores';
import { Transacting } from '$lib/stores/transactor';
import { getTimestamp } from '$lib/common/helper';

export class Signature {
	validity = 10 * 60;
	timeout;
	deadline;
	value;
	split;

	constructor() {}

	async create(tokenContract, spender, value) {
		clearTimeout(this.timeout);
		this.deadline = getTimestamp() + this.validity;
		this.timeout = setTimeout(() => {
			reset();
			Notifier.warning('Signature Expired');
		}, this.validity * 1000);

		Transacting.start('Signing');

		try {
			this.value = await signPermit(
				tokenContract,
				defaultEvmStores.$chainId,
				defaultEvmStores.$signer,
				spender,
				value,
				this.deadline
			);

			this.split = ethers.utils.splitSignature(this.value);
		} catch (e) {
			Notifier.danger(e);
		}

		Transacting.stop();
	}

	reset() {
		this.value = undefined;
		this.split = undefined;
		this.deadline = 0;
		clearTimeout(this.timeout);
		return this;
	}
}

///
/// EIP-712 Implementation, Returns the signature for the given parameters
///
export async function signPermit(token, chainId, signerAccount, spender, value, givenDeadline) {
	const tokenName = await token.name();
	const owner = await signerAccount.getAddress();
	const nonce = await token.nonces(owner);
	const deadline = givenDeadline || ethers.constants.MaxUint256;

	const domain = {
		name: tokenName,
		version: '1',
		chainId: chainId,
		verifyingContract: token.address
	};

	const types = {
		Permit: [
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' },
			{ name: 'value', type: 'uint256' },
			{ name: 'nonce', type: 'uint256' },
			{ name: 'deadline', type: 'uint256' }
		]
	};

	// The data to sign
	const message = {
		owner: owner,
		spender: spender,
		value: value,
		nonce: nonce,
		deadline: deadline
	};

	console.log('signPermit', message);

	let raw;

	if (signerAccount.signTypedData) {
		raw = await signerAccount.signTypedData(domain, types, message);
	} else {
		raw = await signerAccount._signTypedData(domain, types, message);
	}
	let verifiedAddress = ethers.utils.verifyTypedData(domain, types, message, raw);

	return verifiedAddress === owner ? raw : undefined;
}
