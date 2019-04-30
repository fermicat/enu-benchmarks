# enu-benchmarks
Visualization of the CPU benchmarks on Enumivo network. This benchmark targets the CPU by calculating Mersenne prime numbers. Calculating primes is an industry standard for measuring CPU performance and it uses code operations that are common in software development.


## contract
The contract is C++ smart contract on ENU mainnet. the contract address is: [link](http://enumivo.qsx.io/transactions/8545b8625c105fb971a58454ce1687dceeb24d8473d7db77ef16a1d32fbe1af6), ported by quantumcat@[enubifreedom group](http://enubi.org), using the same method of [EOS Mechanics](https://eosmechanics.com/).

## backend and infrastructures tool

The benchmarks below are EOS contracts which are set on the `enubifreelab` account on Mainnet. They are executed during each block producers' schedule, and the timings recorded on-chain using the standard `cpu_usage_us` transaction field. The data is [freely available](https://wallet.enumivo.com/accounts/enubifreelab) to view and analyze, and we encourage doing so to help identify issues and improve block producer performance.

The demo codes extract the data from `eosmechanics` at EOS mainnet, to save ENU token.

the `./backend/` is going to place in the web server sharing with frontend, while `./infra/` is located at the RPC server.

## frontend
HTML visualization.
