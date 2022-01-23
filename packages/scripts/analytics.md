
# Analytics SQL queries

## Number of tasks created per day (filtering out Dework and Lonis tasks)
```sql
SELECT COUNT(*), DATE(task."createdAt")
FROM task
INNER JOIN project ON project.id = task."projectId"
WHERE project."organizationId" != 'dde641cb-b50e-403f-955a-f83c154e441f'
  AND task."creatorId" != 'c1f5e5fe-4287-412d-a478-6c89e7b1a190'
GROUP BY DATE(task."createdAt")
ORDER BY DATE(task."createdAt") DESC
```

## Number of payments per network
```sql
SELECT COUNT(*), DATE(payment."createdAt"), payment_network."name"
FROM payment
INNER JOIN payment_network ON payment_network.id = payment."networkId"
WHERE payment_network."name" NOT IN ('Ethereum Rinkeby')
  -- AND payment.status = 'CONFIRMED'
GROUP BY DATE(payment."createdAt"), payment_network."name"
ORDER BY DATE(payment."createdAt") DESC
```
## List of payments
```sql
SELECT
	DATE(payment."createdAt"),
	payment_network."name",
	payment_token.symbol,
	task_reward.amount::DECIMAL / POWER(10, payment_token."exp") AS amount
FROM payment
INNER JOIN payment_network ON payment_network.id = payment."networkId"
INNER JOIN task_reward ON task_reward."paymentId" = payment.id
INNER JOIN payment_token ON payment_token.id = task_reward."tokenId"
WHERE payment_network."name" NOT IN ('Ethereum Rinkeby', 'Stacks Testnet')
  AND payment.status = 'CONFIRMED'
ORDER BY DATE(payment."createdAt") DESC
```

## Tasks with/without rewards
```sql
SELECT *
FROM task
INNER JOIN project ON project.id = task."projectId"
WHERE project."organizationId" != 'dde641cb-b50e-403f-955a-f83c154e441f'
  AND task."creatorId" != 'c1f5e5fe-4287-412d-a478-6c89e7b1a190'
  AND task."rewardId" IS (NOT) NULL
  AND task.status = 'TODO'
  AND name NOT LIKE '%test%'
  AND description NOT LIKE '%test%'
  AND task."deletedAt" IS NULL
```
