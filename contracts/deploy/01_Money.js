const {ethers} = require('hardhat');

module.exports = async ({getNamedAccounts, deployments, getChainId}) => {
	const {deploy} = deployments;
	const {deployer} = await getNamedAccounts();
	const chainId = await getChainId();

	console.log(`🛰  Deploying: "Money"`);
	await deploy('Money', {
		from: deployer,
		log: true,
		args: []
	});
	console.log(`✅  Successfully deployed: "Money"`);
};
module.exports.tags = ['test', 'production'];
