import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const NETWORK_MAINNET_RPC_URL = process.env.ALCHEMY_MAINNET_URL;
const NETWORK_TESTNET_RPC_URL = process.env.ALCHEMY_TESTNET_URL;
const TESTNET_PRIVATE_KEY = process.env.TESTNET_PRIVATE_KEY;

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
	defaultNetwork: "PolygonMumbai",
	networks: {
		PolygonMumbai: {
			url: NETWORK_TESTNET_RPC_URL,
			accounts: [TESTNET_PRIVATE_KEY!],
			chainId: 80001,
		},
		PolygonMainnet: {
			url: NETWORK_MAINNET_RPC_URL,
			accounts: [TESTNET_PRIVATE_KEY!],
			chainId: 137,
		},
		hardhat: {
			allowUnlimitedContractSize: false,
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
