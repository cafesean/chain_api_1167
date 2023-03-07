interface JSONObject {
	[key: string]: any;
}

export class TokenService {
	async hello() {
		return "token-api v1";
	}

	async mint(contract: any, classId: number, address: string) {
		//}, skillIds:string[], skillScores:number[], attributeIds:number[], attributeValues:string[]) {
		console.log("contract: ", contract.address);
		console.log("address: ", address);
		console.log("classId: ", classId);

		try {
			var newTokenId = await contract.mint(classId, address, [], [], [], []);
			console.log("newTokenId: ", newTokenId);
			return newTokenId;
		} catch (err) {
			return err;
		}
	}

	async safeTransferFrom(
		contract: any,
		from: string,
		to: string,
		id: number,
		amount: number
	) {
		try {
			await contract.safeTransferFrom(from, to, id, amount, "0x");
			return "success";
		} catch (err) {
			return err;
		}
	}

	async burn(contract: any, id: number) {
		try {
			await contract.burnBatchById([id]);
			return "success";
		} catch (err) {
			return err;
		}
	}

	async getUris(contract: any, from: number, to: number) {
		var i;
		var data: JSONObject = {};
		try {
			for (i = from; i <= to; i++) {
				data["uri" + i] = await contract.uri(i);
			}
			return JSON.stringify(data);
		} catch (err) {
			return err;
		}
	}
}
