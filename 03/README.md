# Voting Dapp
This project is the dapp for the Voting contract.

## Deployment
This dapp has been deployed [here](https://voting-4854d.web.app/) with the contracts deployed on ropsten.

## Demo

![Demo video](dapp.gif)



## Installation
1. Deploy the contract:
    ```
    cd truffle
    npm install
    INFURA_PROJECT_ID="xxx" MNEMONIC="xxx" truffle migrate --network ropsten
    ```

2. Start the app
    ```
    cd client
    npm install
    npm run start
    ```