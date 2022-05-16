# 💩 Sharthat-Template

A starter template using [Svelte](https://svelte.dev/), [SvelteKit](https://kit.svelte.dev/), [TailwindCSS](tailwindcss.com/), [ethers.js](https://docs.ethers.io/v5/), [svelte-ethers-store](https://gitlab.com/clb1/svelte-ethers-store), [hardhat](https://hardhat.org/getting-started/) and [hardhat-deploy](https://github.com/wighawag/hardhat-deploy). Kept simple for easy extensibility.

> [Demo](https://sharthat.on.fleek.co/)

## Features

* [Debug UI](https://sharthat.on.fleek.co/debug/)
* Transaction Notifications
* Ready to use and easily extensible generic components and stores (e.g. toasts, tooltips, balances, ...)
* Out of the box support for [EIP-712 Permits](https://eips.ethereum.org/EIPS/eip-2612)
* Advanced Waffle testing examples using Fixtures
* Support for multiple EVM chains



# Quick Start

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/), [pnpm](https://pnpm.io/installation) and [Git](https://git-scm.com/downloads)

Clone/fork:
```bash
git clone https://github.com/0xD006F00D/sharthat-template.git shart-project
# or
git clone git@github.com:0xD006F00D/sharthat-template.git shart-project
# navigate to dir for following commands
cd shart-project
```

Install dependencies:
```shell
pnpm install
```

In a new window start the Hardhat chain:
```shell
pnpm chain
```

In a new window deploy your contracts to the default network (localhost):
```shell
pnpm deploy
```

In a new window run the frontend dev server:
```shell
pnpm dev
```

Modify or add smart contracts in `contracts/src/`

Edit the deployment scripts in `contracts/deploy/`

Edit the frontend in `frontend/src/routes/index.svelte`

Create new components in `frontend/src/components/`

Open http://localhost:3000 to see the app

# More about the Contracts

To compile and export the contract ABI:
```shell
pnpm export
```

> `pnpm deploy` and `pnpm export` will automatically export copy the compiled contract ABI to `frontend/src/lib/common/contractAbi.json`

Configure the .env:
```shell
cp .env.example .env
```
> `TEST_WALLET_ADDRESS` can be configured with a specific wallet address that should be funded and used as deployer with the hardhat networks

> `DEPLOYER_PRIVATE_KEY` can be configured with a private key that should be used for contract deployments on test networks and mainnets

> Get your [Alchemy](https://alchemy.com/?r=zMxODI2NjkzNDM0M) and/or [POKT](https://mainnet.portal.pokt.network/#/signup) API keys

Run your tests and see the [gas usage](https://github.com/cgewecke/hardhat-gas-reporter):
```shell
pnpm test
```
> Create and modify [waffle tests](https://ethereum-waffle.readthedocs.io/en/latest/) in `contracts/tests`

Check you [test coverage](https://github.com/sc-forks/solidity-coverage):
```shell
pnpm coverage
```

Generate the [documentation](https://github.com/primitivefinance/primitive-dodoc) in markdown format ([Example](/contracts/docs/)):
```shell
pnpm dodoc
```
> Document your solidity code using [Natspec](https://docs.soliditylang.org/en/v0.8.9/natspec-format.html)

[Verify](https://github.com/NomicFoundation/hardhat/tree/master/packages/hardhat-etherscan) your deployed contracts for a specific network (e.g. Rinkeby):
```shell
pnpm verify:network rinkeby
```
> The blockexplorer API keys bust be set in the `.env` file.

> The hardhat-deploy task `etherscan-verify` is used by default

Deploy your contracts to a specific network (e.g. Rinkeby):
```shell
pnpm deploy:network rinkeby
```
> Will by default only pick up scripts tagged `production`

# More about the Frontend 

> To use other networks than hardhat get your [Alchemy](https://alchemy.com/?r=zMxODI2NjkzNDM0M) and/or [POKT](https://mainnet.portal.pokt.network/#/signup) API keys and set them in `frontend/src/common/constants.js`

## Commands

Building the frontend:
```bash
pnpm run build
```

Preview the production build:
```bash
pnpm run preview
```

> By default [adapter-static](https://github.com/sveltejs/kit/tree/master/packages/adapter-static) is used to pre-render the site as a collection of static files, allowing deployment to ipfs, surge, fleek, etc.

Deploy the frontend e.g. via Fleek

>[Sign up to Fleek for free](https://fleek.co/) and link your git repo ([Documentation](https://docs.fleek.co/hosting/overview/))


## Components

Transactor
```JavaScript
import { Transacting, tx } from '$lib/stores/transactor';

// Automatically shows notification until transaction completed
const txSuccess = await tx($contracts.TokenVendor.withdraw, ethAmount);

// Read whether a transaction is currently happening via Store
let isTransacting = $Transacting

// Show transacting notification with specific message and set $Transacting
const notificationId = Transacting.start(message)

// Stop showing a specific transaction notification and unset $Transacting
Transacting.stop(notificationId);
```

Notifier
```JavaScript
import { Notifier } from '$lib/stores/notifier';

// Automatically parses evm errors and reverts to a readable message
Notifier.danger(exception);
Notifier.warning(revert);
Notifier.info(error);
Notifier.success("Success");
```

Tooltip
```JavaScript
import Tooltip from '$lib/generic/tooltip.svelte';

<Tooltip text={"Sample Text"}>?</Tooltip>
```

Address
```JavaScript
import Address from '$lib/generic/address.svelte';

<Address address={$signerAddress} />

// Custom tooltip and click function
<Address address={$signerAddress} tooltipText="Add" clickAction={addToContacts} />

// Disable tooltip and clickAction
<Address address={$signerAddress} disabled />
```


Address Input
```JavaScript
import Identicon from '$lib/generic/identicon.svelte';

<Identicon input address={address}>
    <input placeholder="Address" bind:value={address} />
</Identicon>
```

Expandable Panel
```JavaScript
import Panel from '$lib/generic/panel.svelte';

<Panel {name}>
    <Address slot="header" value={contract.address} />
    <Contract
        readContract={ReadEvmStores.$contracts.TokenVendor}
        writeContract={$contracts.TokenVendor} />
</Panel>
```

Popup
```JavaScript
import Popup from '$lib/generic/panel.svelte';

let showMessage = false;

<Popup bind:show={showMessage}>
    <h1>Message</h1>
    <button id="transferCancelButton" on:click={() => (showMessage = false)}>
        Close
    </button>
</Popup>
```

## Stores

Evm Store
> Visit the [svelte-ethers-store documentation](https://gitlab.com/clb1/svelte-ethers-store) for more information about available default evm stores
```Javascript
import { ReadEvmStores } from '$lib/stores/evm';

/// ReadEvmStores get initialized on page load for the selected network
/// Allows reading of contract data without a wallet connection
const isConnected = ReadEvmStores.$connected;
```

Balances
```Javascript
import { NativeBalance, TokenBalance } from '$lib/stores/balances';

// use .display for eth formatted string with two decimal places
// use .value to get the actual big number value in wei
const nativeDisplay = $NativeBalance.display + $NativeBalance.symbol;
const tokenAmount = $TokenBalance.value;
```


Settings
> Additional settings can be added in `frontend/src/lib/stores/settings`. The settings UI can be configured in `frontend/src/lib/components/usersettings.svelte`.
```Javascript
import { Settings } from '$lib/stores/settings';

const isDebugMode = $Settings.debug;
```

## Other

Signature
```Javascript
import { Signature } from '$lib/common/signature';

// Create a new Signature Object
let signature = new Signature();

// Initialize Signature with required values
await signature.create($contracts.Money, $contracts.TokenVendor.address, tokenAmount);

// Check the state of the signature
let isSigned = signature.value;

// Send transaction that requires a EIP-712 signature
const txSuccess = await tx(
    $contracts.TokenVendor.sellWithPermit,
    tokenAmount,
    signature.deadline,
    signature.split.v,
    signature.split.r,
    signature.split.s
);

// Reset the signature after completion
// Assignment is needed to let svelte know the signature changed
signature = signature.reset();
```


# Credits

Many thanks to my dog who came up with the name