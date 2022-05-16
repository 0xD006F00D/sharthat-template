const {ethers} = require('hardhat');

module.exports = async ({getNamedAccounts, deployments, getChainId}) => {
	const {execute} = deployments;
	const {deployer} = await getNamedAccounts();
	const chainId = await getChainId();

	const TokenVendor = await ethers.getContract('TokenVendor', deployer);

	console.log('🛰  SetPrinter', TokenVendor.address);
	//await Money.setPrinter(TokenVendor.address); //ethers call
	await execute('Money', {from: deployer}, 'setPrinter', TokenVendor.address); //hardhat-deploy call
};
module.exports.tags = ['test', 'production'];
