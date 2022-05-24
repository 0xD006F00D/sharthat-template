const {ethers} = require('hardhat');

module.exports = async ({getNamedAccounts, deployments, getChainId, availableAccounts}) => {
	const {deploy} = deployments;
	const {deployer, tester} = await getNamedAccounts();
	const chainId = await getChainId();

	// The deployer named account has no funding by default
	// So we fund it as it will be the deployer and owner of our contracts
	if (chainId == 31337 && tester) {
		console.log('🛰  Fund', tester);
		const defaultSigner = ethers.provider.getSigner(deployer);
		await defaultSigner.sendTransaction({
			to: tester,
			value: ethers.utils.parseEther('10')
		});
	}
};
module.exports.tags = ['test'];
