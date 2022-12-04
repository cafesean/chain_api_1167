
interface JSONObject {
    [key: string]: any
}

export class TokenService {
    async hello() {
        return "token-api v1";
    }
    
    async getUris(contract: any, from: number, to: number) {
        var i;
        var data: JSONObject = {};
        try {
            for (i = from; i <= to; i++) {
                data["uri" + i] = await contract.uri(i);;
            }
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }

    }
}
