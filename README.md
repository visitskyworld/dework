
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

Just copy the .env.template files and ask the core team for the missing environment variables.

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
docker volume ls
docker volume rm <name of api db volume>
yarn dev:db
```
