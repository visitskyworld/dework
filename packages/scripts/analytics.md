
# Analytics SQL queries

## Number of tasks created per day (filtering out Dework and Lonis tasks)
```sql
SELECT COUNT(*), DATE(task."createdAt")
FROM task
INNER JOIN project ON project.id = task."projectId"
WHERE project."organizationId" != 'dde641cb-b50e-403f-955a-f83c154e441f'
  AND task."creatorId" != 'c1f5e5fe-4287-412d-a478-6c89e7b1a190'
  AND task.description NOT LIKE 'Originally created from%'
  AND task."parentTaskId" IS NULL
GROUP BY DATE(task."createdAt")
ORDER BY DATE(task."createdAt") DESC
```

## Number of payments per network
```sql
SELECT COUNT(*), DATE(payment."createdAt"), payment_network."name"
FROM payment
INNER JOIN payment_network ON payment_network.id = payment."networkId"
INNER JOIN task_reward ON task_reward."paymentId" = payment.id
WHERE payment_network."name" NOT IN ('Ethereum Rinkeby', 'Stacks Testnet')
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
	task_reward.amount::DECIMAL / POWER(10, payment_token."exp") AS amount,
	organization."name"
FROM payment
INNER JOIN payment_network ON payment_network.id = payment."networkId"
INNER JOIN task_reward ON task_reward."paymentId" = payment.id
INNER JOIN task ON task."rewardId" = task_reward.id
INNER JOIN project ON project.id = task."projectId"
INNER JOIN organization ON organization.id = project."organizationId"
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
  AND task.name NOT LIKE '%test%'
  AND task.description NOT LIKE '%test%'
  AND task."deletedAt" IS NULL
```

## List Discord user ids and discriminators (useful for when merging two accounts)
```sql
SELECT
	threepid.id,
	threepid."userId",
	threepid.config->'profile'->'username' AS username,
	threepid.config->'profile'->'discriminator' AS discriminator
FROM threepid
WHERE threepid."source" = 'discord'
```

## Check `PENDING` payments for an organization
```sql
SELECT payment."createdAt", payment.status, payment.id as paymentId, r.amount, t.id as taskId, u.id as userId, pm.address, payment."networkId"
FROM payment
INNER JOIN task_reward r ON r."paymentId" = payment.id
INNER JOIN task t ON t."rewardId" = r.id
INNER JOIN project p ON p.id = t."projectId"
INNER JOIN task_assignees ta ON ta."taskId" = t.id
INNER JOIN "user" u ON u.id = ta."userId"
INNER JOIN payment_method pm ON pm."userId" = u.id
INNER JOIN payment_method_network pmn ON pmn."paymentMethodId" = pm.id AND pmn."paymentNetworkId" = payment."networkId"
-- WHERE p."organizationId" = 'organization id'
  AND payment.status = 'PROCESSING'
ORDER BY payment."createdAt" ASC
```

## List projects by most recently created task
```sql
select max(task."createdAt"), project.id, project.name, organization.id, organization."name"
from project
inner join task on project.id = task."projectId"
inner join organization on organization.id = project."organizationId"
group by project.id, organization."name"
order by max(task."createdAt") desc
```

## Manually find a task's payment (e.g. to manually mark it as confirmed)
```sql
select payment.*
from payment
inner join task_reward on task_reward."paymentId" = payment.id
inner join task on task."rewardId" = task_reward.id
where task.id = '87cc9bd0-f887-4840-9de7-e3bdb2672d99'
```
