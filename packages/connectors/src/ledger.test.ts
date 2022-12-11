import { testChains } from '@wagmi/core/internal/test'
import { describe, expect, it } from 'vitest'

import { LedgerConnector } from './ledger'

describe('LedgerConnector', () => {
  it('inits', () => {
    const connector = new LedgerConnector({
      chains: testChains,
      options: {},
    })
    expect(connector.name).toEqual('Ledger')
  })

  describe('behavior', () => {
    it.todo('connects')

    it.todo('disconnects via dapp (wagmi Connector)')

    it.todo('disconnects via wallet (Ledger Live)')

    it.todo('switch chains via dapp (wagmi Connector)')

    it.todo('switch chains via wallet (Ledger Live)')

    it.todo('switch accounts via wallet (Ledger Live)')

    it.todo('sends a transaction')

    it.todo('signs a message')
  })
})
