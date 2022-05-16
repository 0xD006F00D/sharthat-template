import * as ContractABIJson from './contractsAbi.json';

export const POKT_ID = '6280c3fd25a687003a6bfde5';
export const ALCHEMY_KEY = '';

export const ContractsABI = ContractABIJson.default;

export const MainnetNetworks = [
	{
		name: 'Ethereum',
		chainId: 1,
		rpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
		//rpcUrl: `https://eth-mainnet.gateway.pokt.network/v1/lb/${POKT_ID}`,
		logo: '/logos/ethereum-eth-logo.svg',
		testnet: false,
		enabled: true
	},
	{
		name: 'Arbitrum',
		chainId: 42161,
		rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
		//rpcUrl: 'https://arb1.arbitrum.io/rpc',
		logo: '/logos/arbitrum-eth-logo.svg',
		testnet: false,
		enabled: true
	},
	{
		name: 'Optimism',
		chainId: 10,
		rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
		//rpcUrl: `https://mainnet.optimism.io`,
		logo: '/logos/optimism-eth-logo.png',
		testnet: false,
		enabled: true
	},
	{
		name: 'Avalanche',
		chainId: 43114,
		rpcUrl: `https://avax-mainnet.gateway.pokt.network/v1/lb/${POKT_ID}`,
		//rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
		logo: '/logos/avalanche-avax-logo.svg',
		testnet: false,
		enabled: true
	},
	{
		name: 'Fantom',
		chainId: 250,
		rpcUrl: `https://fantom-mainnet.gateway.pokt.network/v1/lb/${POKT_ID}`,
		//rpcUrl: `https://rpcapi.fantom.network`,
		logo: '/logos/fantom-ftm-logo.svg',
		testnet: false,
		enabled: true
	},
	{
		name: 'Harmony',
		chainId: 1666600000,
		rpcUrl: `https://harmony-0.gateway.pokt.network/v1/lb/${POKT_ID}`,
		//rpcUrl: 'https://harmony-0-rpc.gateway.pokt.network',
		logo: '/logos/harmony-one-logo.svg',
		testnet: false,
		enabled: false
	},
	{
		name: 'Polygon',
		chainId: 137,
		rpcUrl: `https://poly-mainnet.gateway.pokt.network/v1/lb/${POKT_ID}`,
		//rpcUrl: 'https://poly-rpc.gateway.pokt.network/',
		logo: '/logos/polygon-matic-logo.svg',
		price: 1,
		testnet: false,
		enabled: true
	}
];

export const TestNetworks = [
	{
		name: 'Rinkeby',
		chainId: 4,
		rpcUrl: `https://eth-rinkeby.gateway.pokt.network/v1/lb/${POKT_ID}`,
		logo: '/logos/rinkeby-eth-logo.svg',
		testnet: true,
		enabled: true
	},
	{
		name: 'Ropsten',
		chainId: 3,
		rpcUrl: `https://eth-ropsten.gateway.pokt.network/v1/lb/${POKT_ID}`,
		logo: '/logos/ropsten-eth-logo.svg',
		testnet: true,
		enabled: true
	},
	{
		name: 'Kovan',
		chainId: 42,
		rpcUrl: `https://eth-kovan.gateway.pokt.network/v1/lb/${POKT_ID}`,
		logo: '/logos/kovan-eth-logo.svg',
		testnet: true,
		enabled: true
	},
	{
		name: 'Optimistic Kovan',
		chainId: 69,
		rpcUrl: `https://kovan.optimism.io`,
		logo: '/logos/optimism-eth-logo.png',
		testnet: true,
		enabled: true
	},
	{
		name: 'Arbitrum Rinkeby',
		chainId: 421611,
		rpcUrl: `https://rinkeby.arbitrum.io/rpc`,
		logo: '/logos/arbitrum-eth-logo.svg',
		testnet: true,
		enabled: true
	},
	{
		name: 'Avalanche Fuji',
		chainId: 43113,
		rpcUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
		logo: '/logos/avalanche-avax-logo.svg',
		testnet: true,
		enabled: true
	},
	{
		name: 'Fantom Testnet',
		chainId: 4002,
		rpcUrl: `https://rpc.testnet.fantom.network`,
		logo: '/logos/fantom-ftm-logo.svg',
		testnet: true,
		enabled: true
	},
	{
		name: 'Harmony Testnet',
		chainId: 1666700000,
		rpcUrl: `https://api.s0.b.hmny.io`,
		logo: '/logos/harmony-one-logo.svg',
		testnet: true,
		enabled: true
	},
	{
		name: 'Polygon Mumbai',
		chainId: 80001,
		rpcUrl: `https://matic-mumbai.chainstacklabs.com`,
		logo: '/logos/polygon-matic-logo.svg',
		testnet: true,
		enabled: true
	},
	{
		name: 'Localhost',
		chainId: 31337,
		rpcUrl: 'http://localhost:8545/',
		logo: '/logos/hardhat-eth-logo.svg',
		testnet: true,
		enabled: true
	}
];

export const CustomNetworkTemplate = {
	name: 'Custom',
	chainId: 0,
	rpcUrl: '',
	logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=022',
	testnet: false,
	enabled: true,
	custom: true
};
