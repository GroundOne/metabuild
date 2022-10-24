# Questions

**Accounts**

- how to use access keys with e.g. near-api-js to delete an account?

- is it possible to see all NFTs the wallet holds (like the wallet.near.org does)?
  I need to know which NFTs tokens of a particular contract type the wallet holds.

  - does it make sense to implement cross contract calls to retrieve this info by the factory?

- is it possible to see all subaccounts of an account (with near-api-js)?

- is it possible to see what contracts are deployed behind a subaccount?

- Can a contract pay for gas fees of functions? Is there an example?

---

---

---

Irrelevant for today:

...

### Technical / JS Contracts

**General**

- chaining `@call` functions is a bad idea because of max gas per block so sequentially calling them is the way to go, right?

**Testing**

- Is it possible to get the environment infos inside the ava integration tests (maybe from near-workspaces?)

- changing tests to TS, node process consumption explodes

---

---

---

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
