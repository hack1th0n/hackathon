```markdown 
# Database Schema 
All tables: `InnoDB`, `utf8mb4`, `BIGINT UNSIGNED` PKs (unless otherwise stated), restrictive 
foreign keys, `created_at`/`updated_at` timestamps. 
## `users` 
| Column | Type | Notes | 
|---|---|---| 
| `id` | `BIGINT UNSIGNED PK` | | 
| `full_name` | `VARCHAR` | required | 
| `email` | `VARCHAR` UNIQUE | required | 
| `password_hash` | `VARCHAR` | bcrypt | 
| `role` | `ENUM('admin','manager','staff')` | required | 
| `is_active` | `BOOLEAN` | default `TRUE` | 
| `created_at`, `updated_at` | `TIMESTAMP` | | 
## `owners` 
| Column | Type | Notes | 
|---|---|---| 
| `id` | PK | | 
| `full_name`, `phone` | `VARCHAR` | required | 
| `email`, `address`, `notes` | `VARCHAR`/`TEXT` nullable | | 
| `is_archived` | `BOOLEAN` | default `FALSE` | 
## `properties` 
| Column | Type | Notes | 
|---|---|---| 
| `id` | PK | | 
| `owner_id` | FK → `owners.id` | restrictive | 
| `name`, `address`, `city` | `VARCHAR` | required | 
| `property_type` | `ENUM('residential','commercial','mixed')` | required | 
| `description` | `TEXT` nullable | | 
| `is_archived` | `BOOLEAN` | | 
## `units` 
| Column | Type | Notes | 
|---|---|---| 
| `id` | PK | | 
| `property_id` | FK → `properties.id` | restrictive | 
| `unit_code` | `VARCHAR` | required | 
| `floor_label` | `VARCHAR` nullable | | 
| `bedrooms`, `bathrooms` | `INT` nullable | | 
| `monthly_rent` | `DECIMAL(12,2)` | > 0 | 
| `status` | `ENUM('available','occupied','maintenance')` | managed by lease flow only | 
| `is_archived` | `BOOLEAN` | | 
**UNIQUE** `(property_id, unit_code)`. 
## `tenants` 
| Column | Type | Notes | 
|---|---|---| 
| `id` | PK | | 
| `full_name`, `phone` | `VARCHAR` | required | 
| `email`, `address`, `notes` | nullable | | 
| `is_archived` | `BOOLEAN` | | 
## `leases` 
| Column | Type | Notes | 
|---|---|---| 
| `id` | PK | | 
| `unit_id` | FK → `units.id` | restrictive | 
| `tenant_id` | FK → `tenants.id` | restrictive | 
| `start_date`, `end_date` | `DATE` | required | 
| `monthly_rent` | `DECIMAL(12,2)` | > 0 | 
| `deposit_amount` | `DECIMAL(12,2)` | ≥ 0 | 
| `payment_due_day` | `TINYINT UNSIGNED` | 1..28 | 
| `status` | `ENUM('draft','active','ended','cancelled')` | default `draft` | 
| `termination_reason` | `VARCHAR` nullable | required when `status = 'ended'` | 
| `created_by` | FK → `users.id` | restrictive | 
## `payments` 
| Column | Type | Notes | 
|---|---|---| 
| `id` | PK | | 
| `lease_id` | FK → `leases.id` | restrictive | 
| `amount` | `DECIMAL(12,2)` | > 0 | 
| `paid_on` | `DATE` | | 
| `period_year` | `SMALLINT` | 2000..2100 | 
| `period_month` | `TINYINT UNSIGNED` | 1..12 | 
| `method` | `ENUM('cash','bank_transfer','other')` | | 
| `reference`, `notes` | nullable | | 
| `received_by` | FK → `users.id` | restrictive | 
**No stored aggregate / balance.** 
## `expenses` 
| Column | Type | Notes | 
|---|---|---| 
| `id` | PK | | 
| `property_id` | FK → `properties.id` | restrictive | 
| `unit_id` | FK → `units.id` nullable | must belong to `property_id` | 
| `category`, `description` | `VARCHAR`/`TEXT` | required | 
| `amount` | `DECIMAL(12,2)` | > 0 | 
| `expense_date` | `DATE` | | 
| `paid_by` | FK → `users.id` | restrictive | 
## `audit_logs` 
| Column | Type | Notes | 
|---|---|---| 
| `id` | PK | | 
| `user_id` | FK → `users.id` nullable | `NULL` for unauthenticated ops (login failures) | 
| `action` | `VARCHAR` | e.g. `lease.activate` | 
| `entity_type` | `VARCHAR` | e.g. `lease` | 
| `entity_id` | `BIGINT UNSIGNED` | | 
| `details_json` | `JSON` nullable | never contains secrets/PII beyond actor | 
| `created_at` | `TIMESTAMP` | | 
## Conventions - Names: SQL snake_case, JSON camelCase. - Every FK column has an index. - Deletes: `ON DELETE RESTRICT`. Historical rows are **archived**, never deleted. - Money: `DECIMAL(12,2)`. Never `FLOAT`. 
- Dates: `DATE`. Never store timezone-derived `DATETIME` for date-only fields.