
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

## Wiping the DB locally
```bash
(cd packages/api && docker compose down && docker compose stop)
docker volume rm api_dewo-postgres-data
yarn api dev:db
```

## Set up `PaymentNetwork` locally
```sql
DO $$
DECLARE
  ethereum_mainnet_id uuid = uuid_generate_v4();
  ethereum_rinkeby_id uuid = uuid_generate_v4();
  gnosis_chain_id uuid = uuid_generate_v4();
  polygon_id uuid = uuid_generate_v4();gnos
  sokol_testnet_id uuid = uuid_generate_v4();
  solana_mainnet_id uuid = uuid_generate_v4();
  solana_testnet_id uuid = uuid_generate_v4();
BEGIN
  UPDATE task SET "rewardId" = NULL;
  DELETE FROM task_reward;
  DELETE FROM payment;
  DELETE FROM payment_method;
  DELETE FROM payment_token;
  DELETE FROM payment_network;

  INSERT INTO "payment_network" ("id", "name", "slug", "url", "sortKey")
  VALUES
    (ethereum_mainnet_id, 'Ethereum Mainnet', 'ethereum-mainnet', '', '10'),
    (gnosis_chain_id, 'xDai (Gnosis Chain)', 'gnosis-chain', 'https://rpc.xdaichain.com', '11'),
    (polygon_id, 'Polygon Mainnet', 'polygon-mainnet', 'https://polygon-rpc.com', '12'),
    (solana_mainnet_id, 'Solana', 'solana-mainnet', 'https://api.mainnet-beta.solana.com', '13'),
    (ethereum_rinkeby_id, 'Ethereum Rinkeby', 'ethereum-rinkeby', '', '20'),
    (sokol_testnet_id, 'Sokol Testnet', 'sokol-testnet', 'https://sokol.poa.network', '22'),
    (solana_testnet_id, 'Solana Testnet', 'solana-testnet', 'https://api.testnet.solana.com', '21');

  INSERT INTO "payment_token" ("type", "name", "exp", "visibility", "address", "networkId")
  VALUES
    ('ETHER', 'ETH', 18, 'ALWAYS', NULL, ethereum_mainnet_id),
    ('ETHER', 'ETH', 18, 'ALWAYS', NULL, ethereum_rinkeby_id),
    ('ETHER', 'xDAI', 18, 'ALWAYS', NULL, gnosis_chain_id),
    ('ETHER', 'MATIC', 18, 'ALWAYS', NULL, polygon_id),
    ('ETHER', 'SPOA', 18, 'ALWAYS', NULL, sokol_testnet_id),
    ('ERC20', 'USDC', 18, 'ALWAYS', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', ethereum_mainnet_id),
    ('ERC20', 'FAU', 18, 'ALWAYS', '0xFab46E002BbF0b4509813474841E0716E6730136', ethereum_rinkeby_id),
    ('ERC20', 'FAU', 18, 'ALWAYS', '0x3B6578D5A24e16010830bf6443bc9223D6B53480', sokol_testnet_id),

    ('SOL', 'SOL', 9, 'ALWAYS', NULL, solana_mainnet_id),
    ('SOL', 'SOL', 9, 'ALWAYS', NULL, solana_testnet_id),
    ('SPL_TOKEN', 'USDC', 6, 'ALWAYS', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', solana_mainnet_id),
    ('SPL_TOKEN', 'USDC', 6, 'ALWAYS', 'CpMah17kQEL2wqyMKt3mZBdTnZbkbfx4nqmQMFDP5vwp', solana_testnet_id);
END $$;
```
