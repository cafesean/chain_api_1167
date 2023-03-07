import * as dotenv from "dotenv";
import { join } from "path";
import AutoLoad from "@fastify/autoload";
dotenv.config();

// Require the framework
import Fastify from "fastify";

// Instantiate Fastify with some config
const app = Fastify({
	logger: false,
});

// Register your application as a normal plugin.
app
	.register(AutoLoad, {
		dir: join(__dirname, "./plugins"),
	})
	.register(import("../controllers/token"), {
		prefix: "/token",
	});

export default async (req: any, res: any) => {
	await app.ready();
	app.server.emit("request", req, res);
};
