---
'@wagmi/connectors': patch
---

Fixed issue where `UNSTABLE_shimOnConnectSelectAccount` would not bubble up error for MetaMask if request to connect was already active.
