# Contributing Guidelines

Thanks for your interest in contributing to the wagmi references! Please take a moment to review this guide **before submitting a pull request.**

If you want to contribute, but aren't sure where to start, you can create a [new discussion](https://github.com/wagmi-dev/references/discussions).

<br>

## Chains

If you wish to contribute to add an additional chain to `@wagmi/chains`, there are a few requirements to note before submitting a pull request.

### Requirements

- **Must haves**:
  - a Chain ID (`id`),
  - a human readable name (`name`),
  - an internal network label (`network`),
  - a native currency reference (`nativeCurrency`),
  - a public, credible RPC URL.
- **Nice to haves**
  - a block explorer (`blockExplorers`)
  - a multicall contract (`contracts.multicall`)
- **Optional**
  - other named RPC URLs (such as `rpcUrls.alchemy`, `rpcUrls.infura`, etc)
  - ENS registry contract (`contracts.ensRegistry`)
  - testnet flag (`testnet`)

If your chain satisfies the necessary criteria, you may submit a pull request for consideration.

### Attribute reference

The [`Chain` type](../packages/chains/src/types.ts) has a number of important attributes, and you may get stuck on what to add to these. Most of these attributes exist within the [`ethereum-lists/chains` repository](https://github.com/ethereum-lists/chains/tree/3fbd4eeac7ce116579634bd042b84e2b1d89886a/_data/chains).

- `id`: The Chain ID for the network. This can be found by typing the network name into [ChainList](https://chainlist.org/). Example: "Ethereum Mainnet" has a Chain ID of `1`.
- `name`: A human readable name for the network. Example: "Binance Smart Chain Mainnet"
- `network`: An internal network label. Example: "bsc"
- `nativeCurrency`: The native currently of the network. Found from [`ethereum-lists/chains`](https://github.com/ethereum-lists/chains/blob/3fbd4eeac7ce116579634bd042b84e2b1d89886a/_data/chains/eip155-56.json#L20-L24).
- `rpcUrls`: A set of RPC URLs for the chain. Found from [`ethereum-lists/chains`](https://github.com/ethereum-lists/chains/blob/3fbd4eeac7ce116579634bd042b84e2b1d89886a/_data/chains/eip155-56.json#L4-L18).
- `blockExplorers`: A set of block explorers for the chain. Found from [`ethereum-lists/chains`](https://github.com/ethereum-lists/chains/blob/3fbd4eeac7ce116579634bd042b84e2b1d89886a/_data/chains/eip155-56.json#L30-L36).
- `contracts`: A set of deployed contracts for the chain.
  - `multicall3` is optional, but it's address is most likely `0xca11bde05977b3631167028862be2a173976ca11` – you can find the deployed block number on the block explorer.
  - `ensRegistry` is optional – not all chains have an ENS Registry.
- `testnet`: Whether or not the chain is a testnet.

<br>

## Connectors

> **Warning**
>
> **Please ask first before starting work on any significant new connectors.**
>
> To avoid having your pull request declined after investing time and effort in a new connector, we ask that contributors create a [connector request](https://github.com/wagmi-dev/references/discussions/new?category=ideas) before starting work on any significant new connectors. This helps ensure that there is general consensus that the connector is worth adding to `@wagmi/connectors`.

There are a few requirements to note before submitting a pull request:

### The connector must present a **novel use-case**

A novel use-case must present as one that cannot be extended from another connector (such as the `InjectedConnector` or `WalletConnectConnector`).

Examples of **novel** use-cases could be a connector that integrates with:

- the injected `window.ethereum` (a la. `InjectedConnector`)
- a series of wallets via QR Codes or Mobile Deep Links (a la. `WalletConnectConnector`)
- a wallet with it's own SDK (a la. `CoinbaseWalletConnector`)
- hardware wallet(s) via Web USB/Bluetooth
- an Externally Owned Account (e.g. Ethers.js `Wallet`)

Examples of **nonnovel** use-cases would be a connector that:

- extends another connector (e.g. `WalletConnectConnector`) with no significant differences

### Integrations need to be generally available

Your connector integration (e.g. wallet) must be stable & generally available – meaning that they should not be in beta, or restricted to a limited group of users. This ensures that the connector can be used by consumers without limitations or restrictions.

### The connector must be maintained

As this connector will be added to an official wagmi repository, it is essential that it is maintained. The wagmi core team will provide as much assistance as possible to keep the connector up to date with breaking changes from wagmi, but it is your responsibility to ensure that it is kept up to date with downstream dependencies and to respond to issues/discussions related to the connector.

### The connector should have minimal third-party dependencies

The connector should rely on as few external libraries or dependencies as possible. This is important for several reasons. First, it helps to ensure the security of the connector by reducing the potential attack surface (ie. supply chain attacks). Second, it helps to keep the size of the connector's bundle small, which can improve initial page-load performance. Finally, having minimal dependencies can improve the reliability of the connector by reducing the likelihood of conflicts or other issues arising from the use of other external libraries.

### The connector must use MIT dependencies if possible

The connector should use dependencies with an MIT license whenever possible. The MIT license is a permissive open-source license that allows for the use, modification, and distribution of software without many of the restrictions that are common in other open-source licenses. Using dependencies with an MIT license can help to ensure that the connector can be freely used, modified, and distributed by others without any legal complications.

---

<br>

## Basic guide

This guide is intended to help you get started with contributing. By following these steps, you will understand the development process and workflow.

1. [Cloning the repository](#cloning-the-repository)
2. [Installing Node.js and pnpm](#installing-nodejs-and-pnpm)
3. [Installing dependencies](#installing-dependencies)
4. [Submitting a pull request](#submitting-a-pull-request)

## Advanced guide

This guide covers more advanced topics. Pick the topics based on your needs.

5. [Versioning](#versioning)

<br>

---

<br>

## Cloning the repository

To start contributing to the project, clone it to your local machine using git:

```bash
git clone https://github.com/wagmi-dev/references.git
```

Or the [GitHub CLI](https://cli.github.com):

```bash
gh repo clone wagmi-dev/references
```

<div align="right">
  <a href="#basic-guide">&uarr; back to top</a></b>
</div>

## Installing Node.js and pnpm

`references` uses [pnpm](https://pnpm.io) as its package manager. You need to install **Node.js v16 or higher** and **pnpm v7 or higher**.

You can run the following commands in your terminal to check your local Node.js and npm versions:

```bash
node -v
pnpm -v
```

If the versions are not correct or you don't have Node.js or pnpm installed, download and follow their setup instructions:

- Install Node.js using [fnm](https://github.com/Schniz/fnm) or from the [official website](https://nodejs.org)
- Install [pnpm](https://pnpm.io/installation)

<div align="right">
  <a href="#basic-guide">&uarr; back to top</a></b>
</div>

## Installing dependencies

Once in the project's root directory, run the following command to install the project's dependencies:

```bash
pnpm install
```

After the install completes, [git hooks](https://github.com/toplenboren/simple-git-hooks) are set up.

<div align="right">
  <a href="#basic-guide">&uarr; back to top</a></b>
</div>

## Submitting a pull request

When you're ready to submit a pull request, you can follow these naming conventions:

- Pull request titles use the [Imperative Mood](https://en.wikipedia.org/wiki/Imperative_mood) (e.g., `Add something`, `Fix something`).
- [Changesets](#versioning) use past tense verbs (e.g., `Added something`, `Fixed something`).

When you submit a pull request, GitHub will automatically lint, build, and test your changes. If you see an ❌, it's most likely a bug in your code. Please, inspect the logs through the GitHub UI to find the cause.

<div align="right">
  <a href="#basic-guide">&uarr; back to top</a></b>
</div>

<br>

---

<div align="center">
  ✅ Now you're ready to contribute! Follow the next steps if you need more advanced instructions.
</div>

---

<br>

## Versioning

When adding new features or fixing bugs, we'll need to bump the package versions. We use [Changesets](https://github.com/changesets/changesets) to do this.

> **Note**
>
> Only changes to the codebase that affect the public API or existing behavior (e.g. bugs) need changesets.

Each changeset defines which package(s) should be published and whether the change should be a major/minor/patch release, as well as providing release notes that will be added to the changelog upon release.

To create a new changeset, run `pnpm changeset`. This will run the Changesets CLI, prompting you for details about the change. You’ll be able to edit the file after it’s created — don’t worry about getting everything perfect up front.

Since we’re currently in beta, all changes should be marked as a minor/patch release to keep us within the `v0.x` range.

Even though you can technically use any markdown formatting you like, headings should be avoided since each changeset will ultimately be nested within a bullet list. Instead, bold text should be used as section headings.

If your PR is making changes to an area that already has a changeset (e.g. there’s an existing changeset covering theme API changes but you’re making further changes to the same API), you should update the existing changeset in your PR rather than creating a new one.

### Releasing

The first time a PR with a changeset is merged after a release, a new PR will automatically be created called `chore: version packages`. Any subsequent PRs with changesets will automatically update this existing version packages PR. Merging this PR triggers the release process by publishing to npm and cleaning up the changeset files.

### Creating a snapshot release

If a PR has changesets, you can create a [snapshot release](https://github.com/changesets/changesets/blob/main/docs/snapshot-releases.md) by [manually dispatching](https://github.com/wagmi-dev/create/actions/workflows/snapshot.yml) the Snapshot workflow. This publishes a tagged version to npm with the PR branch name and timestamp.

<div align="right">
  <a href="#advanced-guide">&uarr; back to top</a></b>
</div>
