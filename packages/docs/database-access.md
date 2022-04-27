
# Database access

## User to read and write payment tokens

```sql
CREATE USER username WITH PASSWORD 'password';
GRANT CONNECT ON DATABASE database_name TO username;
GRANT USAGE ON SCHEMA dework TO username;
GRANT SELECT ON payment_token TO username;
GRANT UPDATE(config) ON payment_token TO username;
```