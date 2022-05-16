const {ethers} = require('hardhat');
const {deployContract} = require('ethereum-waffle');

const MoneyABI = require('../../artifacts/src/Money.sol/Money.json');
const TokenVendorABI = require('../../artifacts/src/TokenVendor.sol/TokenVendor.json');

const deployOverrides = {
	gasLimit: 30000000
};

const testFixture = async function ([wallet, other], provider) {
	const Money = await deployContract(wallet, MoneyABI, [], deployOverrides);
	const TokenVendor = await deployContract(
		wallet,
		TokenVendorABI,
		[Money.address],
		deployOverrides
	);

	await Money.setPrinter(TokenVendor.address);

	return {Money, TokenVendor};
};

module.exports = {testFixture};
