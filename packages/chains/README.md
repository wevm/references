# `@wagmi/chains`

References to popular EVM-compatible chains.

## Installation

Install the `@wagmi/chains` package.

```
npm i @wagmi/chains
```

## Usage

Use your preferred chains!

```tsx
import { configureChains } from 'wagmi'
import { avalanche, bsc, mainnet } from '@wagmi/chains'

const { chains, provider } = configureChains(
  [mainnet, avalanche, bsc],
  ...
)
```

> If your bundler supports tree-shaking (most likely), only the used chains will be included in the bundle, so you don't have to worry about bundle size. 😊

## Chains

- `arbitrum`
- `arbitrumGoerli`
- `arbitrumNova`
- `aurora`
- `auroraTestnet`
- `avalanche`
- `avalancheFuji`
- `base`
- `baseGoerli`
- `bronos`
- `bronosTestnet`
- `bsc`
- `bscTestnet`
- `canto`
- `celo`
- `celoAlfajores`
- `celoCannoli`
- `classic`
- `cronos`
- `cronosTestnet`
- `edgeware`
- `edgewareTestnet`
- `eos`
- `eosTestnet`
- `ewc`
- `fantom`
- `fantomTestnet`
- `foundry`
- `fuse`
- `goerli`
- `hardhat`
- `iotex`
- `iotexTestnet`
- `localhost`
- `mainnet`
- `mantle`
- `mantleTestnet`
- `metis`
- `metisGoerli`
- `modeTestnet`
- `moonbaseAlpha`
- `moonbeam`
- `moonriver`
- `oasys`
- `okc`
- `optimism`
- `optimismGoerli`
- `polygon`
- `polygonMumbai`
- `pulsechain`
- `pulsechainV4`
- `skaleBlockBrawlers`
- `skaleCalypso`
- `skaleCalypsoTestnet`
- `skaleChaosTestnet`
- `skaleCryptoBlades`
- `skaleCryptoColosseum`
- `skaleEuropa`
- `skaleEuropaTestnet`
- `skaleExorde`
- `skaleHumanProtocol`
- `skaleNebula`
- `skaleNebulaTestnet`
- `skaleRazor`
- `skaleTitan`
- `skaleTitanTestnet`
- `sepolia`
- `taikoTestnetSepolia`
- `taraxa`
- `taraxaTestnet`
- `telos`
- `telosTestnet`
- `volta`
- `zkSync`
- `zkSyncTestnet`
- `zora`
- `zoraTestnet`

## Contributing

Want to add another chain to the list? Make sure you read the [contributing guide](../../.github/CONTRIBUTING.md) first.
