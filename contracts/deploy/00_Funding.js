const {ethers} = require('hardhat');

module.exports = async ({getNamedAccounts, deployments, getChainId}) => {
	const {deploy} = deployments;
	const {deployer} = await getNamedAccounts();
	const chainId = await getChainId();

	// The deployer named account has no funding by default
	// So we fund it as it will be the deployer and owner of our contracts
	if (chainId == 31337) {
		console.log('🛰  Fund', deployer);
		const defaultSigner = ethers.provider.getSigner(0);
		await defaultSigner.sendTransaction({
			to: deployer,
			value: ethers.utils.parseEther('10')
		});
	}
};
module.exports.tags = ['test'];
