
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
(cd packages/api && docker compose down && docker compose stop)
docker volume rm api_dewo-postgres-data
yarn api dev:db
```

## Set up `PaymentNetwork` locally
```sql
DELETE FROM payment_token;
DELETE FROM payment_network;

DO $$
DECLARE
  ethmain_id uuid = uuid_generate_v4();
  ethrinkeby_id uuid = uuid_generate_v4();
BEGIN
  INSERT INTO "payment_network" ("id", "name", "url", "sortKey")
  VALUES
    (ethmain_id, 'Ethereum Mainnet', 'url', '1'),
    (ethrinkeby_id, 'Ethereum Rinkeby', 'url', '2');

  INSERT INTO "payment_token" ("type", "name", "exp", "address", "networkId")
  VALUES
    ('ETHER', 'Ether', 18, NULL, ethmain_id),
    ('ERC20', 'USDC', 18, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', ethmain_id);

  INSERT INTO "payment_token" ("type", "name", "exp", "address", "networkId")
  VALUES
    ('ETHER', 'Ether', 18, NULL, ethrinkeby_id),
    ('ERC20', 'USDC', 18, '0xeb8f08a975ab53e34d8a0330e0d34de942c95926', ethrinkeby_id);
END $$;
```