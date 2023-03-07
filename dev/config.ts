// import { string } from "hardhat/internal/core/params/argumentTypes";

export default interface Config {
	env: string;
	version: string;
	timezone: string;
	// debug: boolean;
	apiKey: string;
	baseUrl: string;
	database: {
		uri: string;
	};
	// redis: {
	// 	host: string;
	// 	port: number;
	// 	password?: string;
	// };
	polygon: {
		baseUrl: string;
		apiKey: string;
	};
	alchemy: {
		apiKey: string;
		network: string;
	};
}
