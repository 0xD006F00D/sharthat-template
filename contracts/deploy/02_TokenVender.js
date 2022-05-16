const {ethers} = require('hardhat');

module.exports = async ({getNamedAccounts, deployments, getChainId}) => {
	const {deploy} = deployments;
	const {deployer} = await getNamedAccounts();
	const chainId = await getChainId();

	const Money = await ethers.getContract('Money', deployer);

	console.log(`🛰  Deploying: "TokenVendor"`);
	await deploy('TokenVendor', {
		from: deployer,
		log: true,
		args: [Money.address]
	});
	console.log(`✅  Successfully deployed: "TokenVendor"`);
};
module.exports.tags = ['test', 'production'];
