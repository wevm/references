# `@wagmi/chains`

## Installation

Install the `@wagmi/chains` reference package.

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
