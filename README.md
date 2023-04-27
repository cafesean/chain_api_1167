# chainxp-api
Official

# Notes
### Smart contracts
- Any changes to smart contracts require "npx hardhat compile"
  - Recompiling REQUIRES complete shutdown / restart of application


# Common problems

### Running tests
Deploying proxy contract group
- Usually run this once per debug session on local, or else need to update contract addresses in the other test steps

Deploying factory
- Name is not important
- Proxy address is from previous step

Cloning
- baseUri is where Opensea will look for JSON file for metadata.
- UUID values must be unique. If cloning more than 1 on Hardhat network, remember to change the UUID to something else
- If using the postgres generated UUID, the string is too long. Need to use a different value for salt.
- org_id MUST exist in the database.
- Factory, Proxy, and Delegate addresses is usually the same if deploying 1 time.

Adding Classes
- series_id MUST exist
- Change the clone address in the POST request to correct one from Cloning step
- template address can be the generated template address

Minting
- Update clone address in the POST request to correct one from Cloning step