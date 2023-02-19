import { ethers } from 'ethers';
import dotenv from "dotenv";
dotenv.config();

export const ASSETS_PATH = "./constants/"

export const ALCHEMY_TESTNET_URL = process.env.ALCHEMY_TESTNET_URL;
export const TESTNET_PRIVATE_KEY = process.env.TESTNET_PRIVATE_KEY;
export const PROXY_CONTRACT = process.env.PROXY_CONTRACT;
export const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_TESTNET_URL);
export const wallet = new ethers.Wallet(<string>TESTNET_PRIVATE_KEY, provider);