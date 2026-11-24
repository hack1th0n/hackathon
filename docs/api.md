```markdown 
# API v1 
Base: `/api/v1`. Same-origin only. Session cookie auth (`express-session` + MySQL store; 
`HttpOnly`, `SameSite=Lax`, `Secure` in production). 
## Envelopes 
**Success** 
```json 
{ "success": true, "data": <resource-or-object>, "meta": { ... }? } 
``` 
Error 
```json 
{ "success": false, "error": { "code": "STRING", "message": "STRING", "details": [ { "field": "x", 
"message": "y" } ] } } 
``` 
List envelope (page-based resources): 
```json 
{ 
"success": true, 
"data": { "items": [ ... ] }, 
"meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 } 
} 
``` 
Pagination 
· page default 1, min 1. 
· limit default 20, max 100 (values above cap are clamped or rejected by service — see 
paginationParams). 
· Filtering/search parameters are forwarded verbatim by controllers; the service decides. 
HTTP status codes 
Code Meaning 
200 OK (read/update) 
201 Created 
400 Validation error (VALIDATION_ERROR) 
401 Unauthenticated (UNAUTHENTICATED, INVALID_CREDENTIALS) 
403 Forbidden (FORBIDDEN) 
404 Not found (*_NOT_FOUND) 
409 Conflict (LEASE_OVERLAP, LEASE_NOT_DRAFT, PAYMENT_EXCEEDS_RENT, ...) 
429 Rate limited (login) 
500 Server error (never leaks stack/SQL) 
Sessions 
· Login regenerates the session id. 
· Logout destroys the session. 
· me re-reads the DB user and rejects if inactive. 
· No Bearer tokens, no localStorage. 
Auth 
Method Path Auth Body 
POST /auth/login public + rate limit { email, password } 
POST /auth/logout required — 
GET /auth/me required — 
Users (admin only) 
Method Path Auth 
GET /users admin 
POST /users admin 
PATCH /users/:id admin 
Note: users create/list/update are a documented handoff — routes exist but currently return 501 
NOT_IMPLEMENTED until the service layer adds userService.
{listUsers,createUser,updateUser}. 
Owners 
Method Path Auth Body 
GET /owners authenticated — 
POST /owners manager+ { fullName, phone, email?, address?, notes? } 
PATCH /owners/:id manager+ same fields, all optional 
Properties & Units 
Method Path Auth Body 
GET /properties authenticated — 
GET /properties/:id authenticated — (response includes units[]) 
POST /properties manager+ { ownerId, name, propertyType, address, city, description? } 
PATCH /properties/:id manager+ same fields, optional 
POST /properties/:id/archive manager+ — 
GET /properties/:id/units authenticated — 
POST /properties/:id/units manager+ { unitCode, floorLabel?, bedrooms?, bathrooms?, 
monthlyRent } 
PATCH /properties/:id/units/:unitId manager+ same fields, optional 
Note: unit endpoints are a documented handoff — routes exist but currently return 501 
NOT_IMPLEMENTED until the service adds propertyService.{listUnits,createUnit,updateUnit}. 
Tenants 
Method Path Auth Body 
GET /tenants authenticated — 
POST /tenants manager+ { fullName, phone, email?, address?, notes? } 
PATCH /tenants/:id manager+ optional 
Leases 
Method Path Auth Body 
GET /leases authenticated — 
POST /leases manager+ { unitId, tenantId, startDate, endDate, monthlyRent, depositAmount, 
paymentDueDay, status? } (status ∈ draft\|active; defaults to draft) 
POST /leases/:id/activate admin+manager — 
POST /leases/:id/terminate admin+manager { terminationReason, endDate? } 
Rules (server-authoritative): 
· New lease defaults draft. 
· Activation requires: unit not archived, tenant active, rent > 0, valid dates, due day 1..28, and no 
overlapping active lease where 
new_start <= existing_end AND new_end >= existing_start (equal boundaries count as 
overlap). 
· Draft and cancelled leases do not reserve the unit. 
· Activation and termination are transaction-wrapped; unit row is locked (FOR UPDATE) and 
rechecked. 
· Terminated last active lease ⇒ unit becomes available (never overrides maintenance). 
Payments 
Method Path Auth Body 
GET /payments authenticated — 
POST /payments authenticated { leaseId, amount, paidOn, periodYear, periodMonth, method, 
reference?, notes? } 
Rules: 
· Partial payments allowed. 
· Sum for (leaseId, periodYear, periodMonth) must not exceed leases.monthly_rent. 
· draft / cancelled leases reject payments. 
· ended leases accept only period months overlapping [start_date, end_date]. 
· No derived balances stored. 
Expenses 
Method Path Auth Body 
GET /expenses manager+ — 
POST /expenses manager+ { propertyId, unitId?, category, description, amount, expenseDate } 
unitId, if present, must belong to propertyId. 
Dashboard 
Method Path Auth 
GET /dashboard/summary authenticated 
Shape is defined by dashboardService.getSummary(actor); do not add derived columns to 
storage. 
Security properties 
· helmet headers on all responses. 
· Login rate limit applies to POST /auth/login. 
· Session regenerate on successful login. 
· Parameterized SQL everywhere (mysql2 prepared statements). 
· Stack traces / SQL never leak to client (errorHandler). 
· Same-origin: no permissive CORS; mutating requests require CSRF token or strict Origin/
Referer. 
Request body reference (canonical) 
``` 
login        
owner        
property     
unit         
tenant       
lease        
status? } 
{ email, password } 
{ fullName, phone, email?, address?, notes? } 
{ ownerId, name, propertyType, address, city, description? } 
{ unitCode, floorLabel?, bedrooms?, bathrooms?, monthlyRent } 
{ fullName, phone, email?, address?, notes? } 
{ unitId, tenantId, startDate, endDate, monthlyRent, depositAmount, paymentDueDay, 
terminate    { terminationReason, endDate? } 
payment      
{ leaseId, amount, paidOn, periodYear, periodMonth, method, reference?, notes? } 
expense      
``` 
``` --- 
{ propertyId, unitId?, category, description, amount, expenseDate }