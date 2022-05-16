require('dotenv').config();

require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

require('hardhat-deploy');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('@primitivefi/hardhat-dodoc');

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const defaultNetwork = 'localhost';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	defaultNetwork,
	paths: {
		sources: 'src'
	},
	solidity: {
		version: '0.8.13',
		settings: {
			optimizer: {
				enabled: true,
				runs: 10000
			}
		}
	},
	namedAccounts: {
		deployer: {
			default: 'privatekey://' + process.env.DEPLOYER_PRIVATE_KEY,
			31337: process.env.TEST_WALLET_ADDRESS || 0
		}
	},
	dodoc: {
		runOnCompile: false,
		exclude: ['@openzeppelin', 'hardhat']
	},
	gasReporter: {
		enabled: true,
		currency: 'USD',
		excludeContracts: [],
		coinmarketcap: process.env.COINMARKETCAP
		// outputFile: './details/gasReporterOutput.txt',
		// noColors: true
	},
	networks: {
		localhost: {
			saveDeployments: true,
			url: 'http://localhost:8545',
			tags: ['local']
		},
		hardhat: {
			saveDeployments: true,
			// mining: {
			// 	auto: false,
			// 	interval: 5000
			// },
			tags: ['local', 'test']
		},
		rinkeby: {
			url: 'https://eth-rinkeby.alchemyapi.io/v2/' + process.env.ALCHEMY_API_KEY,
			chainId: 4,
			tags: ['staging']
		},
		ropsten: {
			url: 'https://eth-ropsten.alchemyapi.io/v2/' + process.env.ALCHEMY_API_KEY,
			chainId: 3,
			tags: ['staging']
		},
		kovan: {
			url: 'https://eth-kovan.alchemyapi.io/v2/' + process.env.ALCHEMY_API_KEY,
			chainId: 42,
			tags: ['staging']
		},
		mainnet: {
			url: 'https://eth-mainnet.alchemyapi.io/v2/' + process.env.ALCHEMY_API_KEY,
			chainId: 1,
			tags: ['production']
		},
		kovanOptimism: {
			url: 'https://opt-kovan.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY,
			//url: 'https://kovan.optimism.io',
			companionNetworks: {
				l1: 'kovan'
			},
			chainId: 69,
			tags: ['staging']
		},
		optimism: {
			url: 'https://opt-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY,
			//url: 'https://mainnet.optimism.io',
			companionNetworks: {
				l1: 'mainnet'
			},
			chainId: 10,
			tags: ['production']
		},
		rinkebyArbitrum: {
			url: 'https://arb-rinkeby.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY,
			//url: 'https://rinkeby.arbitrum.io/rpc',
			companionNetworks: {
				l1: 'rinkeby'
			},
			chainId: 421611,
			tags: ['staging']
		},
		arbitrum: {
			url: 'https://arb-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY,
			//url: 'https://arb1.arbitrum.io/rpc',
			companionNetworks: {
				l1: 'mainnet'
			},
			chainId: 42161,
			tags: ['production']
		},
		testnetAvalanche: {
			url: 'https://api.avax-test.network/ext/bc/C/rpc',
			chainId: 43113,
			tags: ['staging']
		},
		avalanche: {
			url: 'https://avax-mainnet.gateway.pokt.network/v1/lb/' + process.env.POKT_API_KEY,
			//url: 'https://api.avax.network/ext/bc/C/rpc',
			chainId: 43114,
			tags: ['production']
		},
		testnetFantom: {
			url: 'https://rpc.testnet.fantom.network',
			chainId: 4002,
			tags: ['staging']
		},
		fantom: {
			url: 'https://rpcapi.fantom.network',
			chainId: 250,
			tags: ['production']
		},
		testnetHarmony: {
			url: 'https://api.s0.b.hmny.io',
			chainId: 1666700000,
			tags: ['staging']
		},
		harmony: {
			url: 'https://harmony-0.gateway.pokt.network/v1/lb/' + process.env.POKT_API_KEY,
			chainId: 1666600000,
			tags: ['production']
		},
		testnetPolygon: {
			url: 'https://polygon-mumbai.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY,
			chainId: 80001,
			tags: ['staging']
		},
		polygon: {
			url: 'https://polygon-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY,
			chainId: 137,
			tags: ['production']
		}
	},

	etherscan: {
		apiKey: {
			//https://etherscan.io/
			mainnet: process.env.ETHERSCAN_API_KEY,
			//https://ropsten.etherscan.io
			ropsten: process.env.ETHERSCAN_API_KEY,
			//https://rinkeby.etherscan.io
			rinkeby: process.env.ETHERSCAN_API_KEY,
			//https://goerli.etherscan.io
			goerli: process.env.ETHERSCAN_API_KEY,
			//https://kovan.etherscan.io
			kovan: process.env.ETHERSCAN_API_KEY,
			//https://ftmscan.com/
			opera: process.env.FANTOM_API_KEY,
			//https://testnet.ftmscan.com
			ftmTestnet: process.env.FANTOM_API_KEY,
			//https://optimistic.etherscan.io/
			optimisticEthereum: process.env.OPTIMISM_API_KEY,
			//https://kovan-optimistic.etherscan.io/
			optimisticKovan: process.env.OPTIMISM_API_KEY,
			//https://polygonscan.com
			polygon: process.env.POLYGON_API_KEY,
			//https://mumbai.polygonscan.com/
			polygonMumbai: process.env.POLYGON_API_KEY,
			//https://arbiscan.io/
			arbitrumOne: process.env.ARBITRUM_API_KEY,
			//https://testnet.arbiscan.io/
			arbitrumTestnet: process.env.ARBITRUM_API_KEY,
			//https://snowtrace.io/
			avalanche: process.env.AVALANCHE_API_KEY,
			//https://testnet.snowtrace.io/
			avalancheFujiTestnet: process.env.AVALANCHE_API_KEY,
			//https://explorer.harmony.one
			harmony: process.env.HARMONY_API_KEY,
			//https://explorer.pops.one
			harmonyTest: process.env.HARMONY_API_KEY
		}
	}
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

task('networks', 'Prints all tagged networks').setAction(async (taskArgs) => {
	let mainnetNetworks = [];
	let testnetNetworks = [];
	for (let name in hre.config.networks) {
		if (hre.config.networks[name].tags.includes('staging')) {
			testnetNetworks.push(name);
		}
		if (hre.config.networks[name].tags.includes('production')) {
			mainnetNetworks.push(name);
		}
	}
	console.log('Mainnet', mainnetNetworks);
	console.log('Testnet', testnetNetworks);
});
