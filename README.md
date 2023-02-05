# metabuild

This repo includes the contracts of the Part Token as well as its Token Factory as part of the [metabuild III hackathon](https://metabuildii.devpost.com/).  
The contracts are based on the Near protocol, written in TypeScript (Part Token) and Rust (Token Factory).  
Additionally, the corresponding frontend is also included. It's written in TypeScript (NextJs).

[Design](https://xd.adobe.com/view/f751c412-8537-4f9d-803f-1f00b938c413-a202/grid?hints=off)

[Landing page](https://www.groundone.io/demo2022/)  
[GitBook of the project](https://documentation.groundone.io/)

[Deployed Project App](https:/app.groundone.io/)

## Run

### Frontend

`cd frontend && yarn` - install deps  
`cd frontend && cp .env.example .env` - copy environment variables  
`cd frontend && yarn dev` - run development version

### Smart Contracts

#### Part-Token

`cd contracts/part-token && yarn` - install deps  
`cd contracts/part-token && cp .env.example .env` - copy environment variables
`cd contracts/part-token && yarn build && yarn deploy:dev` - build the contract as `.wasm` files and deploy a instance on a dev account

See the `package.json` files for example calls. Make sure to specify the correct vars in the `.env` file. Next step would be to initialize the contract.

#### Part-Factory

`cd contracts/part-factory && cargo install` - install deps  
`cd contracts/part-factory && cp .env.example .env` - copy environment variables  
`cd contracts/part-factory && yarn build && yarn deploy:dev` - build the contract as `.wasm` files and deploy an instance on a dev account

See the `package.json` files for example calls. Make sure to specify the correct vars in the `.env` file. Next step would be to initialize the contract.
