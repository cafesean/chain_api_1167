
interface JSONObject {
    [key: string]: any
}

export class UserService {   
    async hello() {
        return "user-api v1";
    }

    async getUsers(contract: any, from: number, to: number) {
        var i;
        var data: JSONObject = {};
        try { 
            for (i = from; i <= to; i++) {
                data["user" + i] = await contract.users(i);
                
            }        
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
    }
    
    async updateUsers(contract: any, count: number, from: number, to: number) {
        var i;
        var data: JSONObject = {};
        var users: number[] = [];
        try {
            for (i = from; i <= to; i++) {
                users.push(i);
            } 
            data["response"] = await contract.updateUsersClass([i],i);
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
        
    }
    async getUserSkills(contract: any, id:number, skillId:number) {
        var data: JSONObject = {};
        try { 
            data["skills"] = await contract._userSkills(id, skillId);
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
    }
    async getUserAttributes(contract: any, id:number, attributeId:number) {
        var data: JSONObject = {};
        try { 
            data["attribute"] = await contract._userAttributes(id, attributeId);
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
    }
}