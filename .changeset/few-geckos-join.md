---
'@wagmi/connectors': patch
---

Fixed race condition between `switchNetwork` and mutation Hooks that use `chainId` (e.g. `sendTransaction`).
