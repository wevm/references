# `@wagmi/connectors`

Collection of connectors for wagmi.

## Installation

Install the `@wagmi/connectors` package.

```
npm i @wagmi/connectors
```

## Usage

Configure your wagmi client with connectors!

```tsx
import { configureChains, createClient } from 'wagmi'

import { InjectedConnector } from '@wagmi/connectors/injected'
import { CoinbaseWalletConnector } from '@wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect'

const { chains, provider } = configureChains(...)

const client = createClient({
  connectors: [
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({ chains }),
  ],
  provider,
})
```

> If your bundler supports tree-shaking (most likely), only the used connectors will be included in the bundle, so you don't have to worry about bundle size. 😊

## Connectors

- [`CoinbaseWalletConnector`](/packages/connectors/src/coinbaseWallet.ts)
- [`InjectedConnector`](/packages/connectors/src/injected.ts)
- [`LedgerConnector`](/packages/connectors/src/ledger.ts)
- [`MetaMaskConnector`](/packages/connectors/src/metaMask.ts)
- [`MockConnector`](/packages/connectors/src/mock.ts)
- [`WalletConnectConnector`](/packages/connectors/src/walletConnect.ts)

## Contributing

Want to add another chain to the list? Make sure you read the [contributing guide](../../.github/CONTRIBUTING.md) first.
