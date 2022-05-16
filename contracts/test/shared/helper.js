const { ethers } = require('hardhat');

///
/// EIP-712 Implementation, Returns the signature for the given parameters
///
async function signPermit(token, signer, spender, value, givenDeadline, chainId = 31337) {
	const tokenName = await token.name();
	const owner = signer.address;
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

	let raw = await signer._signTypedData(domain, types, message);
	let verifiedAddress = ethers.utils.verifyTypedData(domain, types, message, raw);

	return verifiedAddress === owner ? ethers.utils.splitSignature(raw) : undefined;
}

module.exports = {
	signPermit
};
