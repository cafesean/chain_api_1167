import { ethers } from "hardhat";

const ProxySol = "ProxyContract";

interface JSONObject {
    [key: string]: any
}

async function attachContract(address: string, contract: string) {
	const contractFactory = await ethers.getContractFactory(contract);
	const attachedContract = contractFactory.attach(address);

	return attachedContract;
}

export class CollectionService {   
    async hello() {
        return "collection-api v1";
    }
    async getCollectionDetail(contract: any) {
        var data: JSONObject = {};
        
        try {
            data["name"] = await contract.name;
            data["baseUri"] = await contract.baseUri;
            data["owner"] = await contract.owner;
            data["hello"] = "hi";
            
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
    }
    
    async setAttributes(contract: any, count: number) {
        var i;
        try { 
            for (i = 1; i <= count; i++) {     
                await contract.setAttributes(i,[i],[1],[],[]);
                // await contractNFT.setAttributes(i, [1,2],[23,35],[1,2,3,4,5,6],["2020","Shanghai","Member","12","Jr. Backend Developer","No"]); 
            }
            return "success";
        } catch (err) {
            return(err);
        }
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
    
    async getClasses(contract_address: any, from: number, to: number) {
        var i;
        var data: JSONObject = {};
        // const [owner] = await ethers.getSigners();
		const contractProxy = await attachContract(contract_address, ProxySol);

        try { 
            for (i = from; i <= to; i++) {
                data["class" + i] = await contractProxy.classes(i);
            }
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
    }
    async getAttributes(contract: any, from: number, to: number) {
        var i;
        var data: JSONObject = {};
        try {
            for (i = from; i <= to; i++) {
                data["attribute" + i] = await contract._attributes(i);
            }
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
    }




    async addClass(contract: any, id:number, name:string, description:string, image:string, classUri:any) {
        try {        
            await contract.addClass(0, contract, id, name, description, image, classUri);
            return "success";
        } catch (err) {
            return(err);
        }
    }

    async setClass(contract: any, id:number, name:string, description:string, image:string, classUri:any) {
        var data: JSONObject = {};
        try {      
            data["class"] = await contract._setClass(id, name, description, image, classUri);
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
    }

    async setAllClassTemplate(contract:any, address:any, from:number, to:number) {        
        var i;
        var data: JSONObject = {};
        try { 
            for (i = from; i <= to; i++) {
                data["class" + i] = await contract._setClass(i,"","", "", address);
            }
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
    }

    async setSkill(contract: any, id:number, name:string, description:string, image:string, skillUri:any) {
        var data: JSONObject = {};
        try { 
            data["skill"] = await contract._setSkill(id, name, description, image, skillUri);
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
    }

    async getClass(contract: any, id: number) {
        //  await contractNFT._classes(1)
        try { 
            return await contract.classes(id);
        } catch (err) {
            return(err);
        }
    }
    async getSkills(contract: any, from: number, to: number) {
        var i;
        var data: JSONObject = {};
        try { 
            for (i = from; i <= to; i++) {
                data["skill" + i] = await contract.skills(i);
            }
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
    }

    async refreshOpensea(address:any, from:number, to:number) {
        const https = require('node:https');
        try {
            var i;
            for (i = from; i <= to; i++) {
                https.get('https://api.opensea.io/assets/' + address + '/' + i + '/force_update=true');
            }
            return "success";
        } catch (err) {
            return(err);
        }
    }

    async grant(contract: any, address:any) {
        try {
            await contract.grantAccess(address, "ADMIN_ROLE");
            return "success";
        } catch (err) {
            return(err);
        }
    }

    async setName(contract: any, updateName:string) {
        var data: JSONObject = {};
        try {
            data["response"] = await contract.setName(updateName); 
            return JSON.stringify(data);
        } catch (err) {
            return(err);
        }
    }
    
    async getName(contract: any) {
        try {
            return await contract.name; 
        } catch (err) {
            return(err);
        }
    }
}