
# Dewo

## Installation
```bash
git clone https://github.com/davidfant/dewo
cd dewo
yarn
```

### Environment variables
To run the project locally you need local environment variables in the following files:
* `packages/api/.env.local`
* `packages/app/.env.local`

Just copy the `.env.template` files and ask the core team for the missing environment variables.

## Development
### 1. Start local Postgres database
```bash
yarn api dev:db
```

### 2. Start API (served on http://localhost:8080)
```bash
yarn api dev
```

### 3. Start app (served on http://localhost:3000)
```bash
yarn app dev
```

## Testing
```bash
yarn api test
```

## Wiping the DB locally
```bash
yarn api db:wipe
```

## Testing on different chains

### Sokol Testnet
1. Add Testnet to Metamask:
https://www.xdaichain.com/for-users/wallets/metamask/metamask-setup

* Network Name: Sokol Testnet
* New RPC URL: https://sokol.poa.network
* Chain ID: 0x4d (77)
* Symbol: xDai
* Block Explorer URL: https://blockscout.com/poa/sokol

2. Get some SPOA (the ETH equivalent native token): https://forum.poa.network/t/sokol-testnet-resources/1776

3. Get some ERC20 tokens: https://erc20faucet.com

## Set up `PaymentNetwork` locally
```sql
DO $$
DECLARE
  ethereum_mainnet_id uuid = uuid_generate_v4();
  ethereum_rinkeby_id uuid = uuid_generate_v4();
  gnosis_chain_id uuid = uuid_generate_v4();
  polygon_id uuid = uuid_generate_v4();
  avalanche_id uuid = uuid_generate_v4();
  fantom_id uuid = uuid_generate_v4();
  harmony_mainnet_id uuid = uuid_generate_v4();
  harmony_testnet_id uuid = uuid_generate_v4();
  sokol_testnet_id uuid = uuid_generate_v4();

  solana_mainnet_id uuid = uuid_generate_v4();
  solana_testnet_id uuid = uuid_generate_v4();

  stacks_mainnet_id uuid = uuid_generate_v4();
  stacks_testnet_id uuid = uuid_generate_v4();

  infura_project_id varchar = 'get this project id from the core team';
BEGIN
  UPDATE task SET "rewardId" = NULL;
  DELETE FROM task_reward;
  DELETE FROM project_token_gate;
  DELETE FROM payment;
  DELETE FROM payment_method;
  DELETE FROM payment_token;
  DELETE FROM payment_network;

  INSERT INTO "payment_network" ("id", "type", "name", "slug", "sortKey", "config")
  VALUES (
    ethereum_mainnet_id,
    'ETHEREUM',
    'Ethereum Mainnet',
    'ethereum-mainnet',
    '000',
    CAST('{
      "chainId": 1,
      "rpcUrl": "https://mainnet.infura.io/v3/' || infura_project_id || '",
      "explorerUrl": "https://etherscan.io",
      "gnosisSafe": {
        "serviceUrl": "https://safe-transaction.gnosis.io"
      }
    }' AS json)
  ), (
    gnosis_chain_id,
    'ETHEREUM',
    'xDai (Gnosis Chain)',
    'gnosis-chain',
    '001',
    CAST('{
      "chainId": 100,
      "rpcUrl": "https://rpc.xdaichain.com",
      "explorerUrl": "https://blockscout.com/xdai/mainnet",
      "gnosisSafe": {
        "serviceUrl": "https://safe-transaction.xdai.gnosis.io",
        "addressPrefix": "xdai"
      }
    }' AS json)
  ), (
    polygon_id,
    'ETHEREUM',
    'Polygon Mainnet',
    'polygon-mainnet',
    '002',
    CAST('{
      "chainId": 137,
      "rpcUrl": "https://polygon-rpc.com",
      "explorerUrl": "https://polygonscan.com",
      "gnosisSafe": {
        "serviceUrl": "https://safe-transaction.polygon.gnosis.io",
        "addressPrefix": "matic"
      }
    }' AS json)
  ), (
    avalanche_id,
    'ETHEREUM',
    'Avalanche Mainnet',
    'avalanche-mainnet',
    '003',
    CAST('{
      "chainId": 43114,
      "rpcUrl": "https://api.avax.network/ext/bc/C/rpc",
      "explorerUrl": "https://cchain.explorer.avax.network"
    }' AS json)
  ), (
    fantom_id,
    'ETHEREUM',
    'Fantom Mainnet',
    'fantom-mainnet',
    '004',
    CAST('{
      "chainId": 250,
      "rpcUrl": "https://rpc.ftm.tools",
      "explorerUrl": "https://ftmscan.com"
    }' AS json)
  ), (
    harmony_mainnet_id,
    'ETHEREUM',
    'Harmony Mainnet',
    'harmony-mainnet',
    '005',
    CAST('{
      "chainId": 1666600000,
      "rpcUrl": "https://api.harmony.one",
      "explorerUrl": "https://explorer.harmony.one/"
    }' AS json)
  ), (
    solana_mainnet_id,
    'SOLANA',
    'Solana',
    'solana-mainnet',
    '010',
    CAST('{
      "cluster": "mainnet-beta",
      "rpcUrl": "https://api.mainnet-beta.solana.com"
    }' AS json)
  ), (
    stacks_mainnet_id,
    'STACKS',
    'Stacks Mainnet',
    'stacks-mainnet',
    '020',
    CAST('{
      "chain": "mainnet",
      "rpcUrl": "https://stacks-node-api.stacks.co"
    }' AS json)
  ), (
    ethereum_rinkeby_id,
    'ETHEREUM',
    'Ethereum Rinkeby',
    'ethereum-rinkeby',
    '100',
    CAST('{
      "chainId": 4,
      "rpcUrl": "https://rinkeby.infura.io/v3/' || infura_project_id || '",
      "explorerUrl": "https://rinkeby.etherscan.io",
      "gnosisSafe": {
        "serviceUrl": "https://safe-transaction.rinkeby.gnosis.io",
        "addressPrefix": "rin"
      }
    }' AS json)
  ), (
    sokol_testnet_id,
    'ETHEREUM',
    'Sokol Testnet',
    'sokol-testnet',
    '101',
    CAST('{
      "chainId": 77,
      "rpcUrl": "https://sokol.poa.network",
      "explorerUrl": "https://blockscout.com/poa/sokol"
    }' AS json)
  ), (
    harmony_testnet_id,
    'ETHEREUM',
    'Harmony Testnet',
    'harmony-testnet',
    '102',
    CAST('{
      "chainId": 1666700000,
      "rpcUrl": "https://api.s0.b.hmny.io",
      "explorerUrl": "https://explorer.pops.one"
    }' AS json)
  ), (
    solana_testnet_id,
    'SOLANA',
    'Solana Testnet',
    'solana-testnet',
    '110',
    CAST('{
      "cluster": "testnet",
      "rpcUrl": "https://api.testnet.solana.com"
    }' AS json)
  ), (
    stacks_testnet_id,
    'STACKS',
    'Stacks Testnet',
    'stacks-testnet',
    '120',
    CAST('{
      "chain": "testnet",
      "rpcUrl": "https://stacks-node-api.testnet.stacks.co"
    }' AS json)
  );

  INSERT INTO "payment_token" ("type", "name", "symbol", "exp", "visibility", "address", "networkId", "config")
  VALUES
    ('NATIVE', 'Ether', 'ETH', 18, 'ALWAYS', NULL, ethereum_mainnet_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/ethereum"
    }' AS JSON)),
    ('ERC20', 'USD Coin', 'USDC', 18, 'ALWAYS', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', ethereum_mainnet_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/usd-coin"
    }' AS JSON)),

    ('NATIVE', 'Ether', 'ETH', 18, 'ALWAYS', NULL, ethereum_rinkeby_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/ethereum"
    }' AS JSON)),
    ('ERC20', 'Faucet Token', 'FAU', 18, 'ALWAYS', '0xFab46E002BbF0b4509813474841E0716E6730136', ethereum_rinkeby_id, NULL),

    ('NATIVE', 'xDAI', 'xDAI', 18, 'ALWAYS', NULL, gnosis_chain_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/xdaistable"
    }' AS JSON)),

    ('NATIVE', 'Matic', 'MATIC', 18, 'ALWAYS', NULL, polygon_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/polygon"
    }' AS JSON)),

    ('NATIVE', 'SPOA', 'SPOA', 18, 'ALWAYS', NULL, sokol_testnet_id, NULL),
    ('ERC20', 'Faucet Token', 'FAU', 18, 'ALWAYS', '0x3B6578D5A24e16010830bf6443bc9223D6B53480', sokol_testnet_id, NULL),

    ('NATIVE', 'Avalanche', 'AVAX', 18, 'ALWAYS', NULL, avalanche_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/avalanche"
    }' AS JSON)),
    ('ERC20', 'USD Coin (Avalanche)', 'USDC.E', 18, 'ALWAYS', '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664', avalanche_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/usd-coin"
    }' AS JSON)),
    ('ERC20', 'Magic Internet Money', 'MIM', 18, 'ALWAYS', '0x130966628846BFd36ff31a822705796e8cb8C18D', avalanche_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/magic-internet-money"
    }' AS JSON)),

    ('NATIVE', 'Fantom', 'FTM', 18, 'ALWAYS', NULL, fantom_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/fantom"
    }' AS JSON)),
    ('ERC20', 'USD Coin (Fantom)', 'USDC', 18, 'ALWAYS', '0x04068da6c83afcfa0e13ba15a6696662335d5b75', fantom_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/usd-coin"
    }' AS JSON)),
    ('ERC20', 'Magic Internet Money', 'MIM', 18, 'ALWAYS', '0x82f0b8b456c1a451378467398982d4834b6829c1', fantom_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/magic-internet-money"
    }' AS JSON)),

    ('NATIVE', 'Harmony', 'ONE', 18, 'ALWAYS', NULL, harmony_mainnet_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/harmony"
    }' AS JSON)),
    ('ERC20', 'USD Coin (Harmony)', 'USDC', 18, 'ALWAYS', '0x44cED87b9F1492Bf2DCf5c16004832569f7f6cBa', harmony_mainnet_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/usd-coin"
    }' AS JSON)),

    ('NATIVE', 'Harmony', 'ONE', 18, 'ALWAYS', NULL, harmony_testnet_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/harmony"
    }' AS JSON)),

    ('NATIVE', 'SOL', 'SOL', 9, 'ALWAYS', NULL, solana_mainnet_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/solana"
    }' AS JSON)),
    ('NATIVE', 'SOL', 'SOL', 9, 'ALWAYS', NULL, solana_testnet_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/solana"
    }' AS JSON)),
    ('SPL_TOKEN', 'USD Coin', 'USDC', 6, 'ALWAYS', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', solana_mainnet_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/usd-coin"
    }' AS JSON)),
    ('SPL_TOKEN', 'USD Coin', 'USDC', 6, 'ALWAYS', 'CpMah17kQEL2wqyMKt3mZBdTnZbkbfx4nqmQMFDP5vwp', solana_testnet_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/usd-coin"
    }' AS JSON)),
    
    ('NATIVE', 'Stacks Token', 'STX', 6, 'ALWAYS', NULL, stacks_mainnet_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/stacks"
    }' AS JSON)),
    ('NATIVE', 'Stacks Token', 'STX', 6, 'ALWAYS', NULL, stacks_testnet_id, CAST('{
      "coinmarketcapUrl": "https://coinmarketcap.com/currencies/stacks"
    }' AS JSON)),
    ('STACKS_TOKEN', 'citycoins', 'CYCN', 1, 'ALWAYS', 'ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A.citycoin-token', stacks_testnet_id, NULL);
END $$;
```
