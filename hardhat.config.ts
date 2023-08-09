import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config({ path: __dirname + "/.env.local" });

// MAINNET
const NETWORK_MAINNET_RPC_URL = process.env.PROVIDER_URL_PROD;
const MAINNET_PRIVATE_KEY = process.env.PRIVATE_KEY_PROD;

// MUMBAI
const NETWORK_TESTNET_RPC_URL = process.env.PROVIDER_URL_TEST;
const TESTNET_PRIVATE_KEY = process.env.PRIVATE_KEY_TEST;

const config: HardhatUserConfig = {
	solidity: {
		version: "0.8.17",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	defaultNetwork: "hardhat",
	networks: {
		PolygonMumbai: {
			url: NETWORK_TESTNET_RPC_URL,
			accounts: [TESTNET_PRIVATE_KEY!],
			chainId: 80001,
		},
		PolygonMainnet: {
			url: NETWORK_MAINNET_RPC_URL,
			accounts: [MAINNET_PRIVATE_KEY!],
			chainId: 137,
		},
		hardhat: {
			allowUnlimitedContractSize: true,
		},
	},
	paths: {
		sources: "./contracts",
		tests: "./ethers/test",
		cache: "./cache",
		artifacts: "./contracts/artifacts",
	},
};

export default config;
