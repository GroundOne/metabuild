# Questions

## Background

#### PART (Priority Access Ranking Token)

A PART is an NFT that gives its holder priority access to the sale of properties in a project, before
the properties are offered publicly. Within the group of PART holders of a project, priority is
organised according to a ranking. Each PART has a different ranking.

#### IRD (Initial Random Distribution)

Before the regular sale of PART tokens opens, people can register to participate in the IRD. The IRD
takes place at the moment of the opening of the regular sale. At the exact IRD block, PARTs are
distributed randomly to users that have previously registered for the IRD.

#### PART Contract

The PART contract is a smart contract that manages the sale process of PARTs (IRD + regular sale)
in Step 1 and the distribution of properties in Step 2. One PART contract is created per project by
an architect/property developer.

## General

- Does the contract can pay for gas fees? -> Owner can payout some near

### Wallet

- what does it take that NFTs are displayed in a wallet?

  - which functions / fields have to be exposed?

- does it make sense to have 2 different NFT Tokens in one contract?

### Technical / JS Contracts

**Token Transfer**

- how to transfer NEAR in the contract?
  - `this.transfer(receiver, amount)`??

**Testing**

- Is it possible to get the environment infos inside the ava integration tests (maybe from near-workspaces?)

- advance time in js tests?

  - Other option to test that time has passed (`presale` / `sale` states in contract), `t.timeout(x)` didn't seem to work?

- how to check balances in testing (where to find the functions? -> Docs?)

- changing tests to TS, node process consumption explodes

**Randomization**

- is the randomize logic with `seed` sound or can be improved?

**Data Types / Variables**

- which data types can be used? are there docs for it? (i128, strings? -> Docs?)

- how can I work with BigInts inside my contract?

  - for testing `near-workspaces` there's { NEAR } has some utility functions.
  - Does the near-sdk-js have equivalent functionality (-> Docs)?

**Init**

- foreach in init function works but for of doesn't?
