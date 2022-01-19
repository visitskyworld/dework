
# Analytics SQL queries

## Number of tasks created per day (filtering out Dework and Lonis tasks)
```sql
SELECT COUNT(*), DATE(task."createdAt")
FROM task
INNER JOIN project ON project.id = task."projectId"
INNER JOIN organization ON organization.id = project."organizationId"
WHERE organization.id != 'dde641cb-b50e-403f-955a-f83c154e441f'
  AND task."creatorId" != 'c1f5e5fe-4287-412d-a478-6c89e7b1a190'
GROUP BY DATE(task."createdAt")
ORDER BY DATE(task."createdAt") DESC
```

