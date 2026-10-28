# API reference

All routes are under `/api`. Success responses use `{ "ok": true, "data": ... }`; errors use `{ "ok": false, "error": { "code", "message", "details?" } }`. Authenticated same-origin requests use the HttpOnly session cookie set at sign-in.

| Method | Route | Access |
| --- | --- | --- |
| GET | `/health` | Public liveness |
| POST | `/auth/signup`, `/auth/login`, `/auth/logout` | Public/session |
| GET | `/auth/me` | Signed in |
| GET | `/public/summary`, `/wards`, `/poles` | Public, aggregate/catalogue only |
| GET | `/report-candidates?ward=&pole=` | Signed in |
| GET | `/reports?page=&limit=&status=&ward=` | Own cases or staff ward |
| POST | `/reports` | Signed in |
| GET | `/reports/:id`, `/reports/:id/duplicates` | Owner or staff ward |
| PATCH | `/reports/:id/status` | Staff/admin |
| POST | `/reports/:id/merge` | Staff/admin |
| POST | `/reports/:id/evidence` | Staff/admin |
| GET | `/metrics` | Staff/admin, ward scoped |

`POST /reports` example:

```json
{"ward_id":"<uuid>","pole_id":"<optional uuid>","location_note":"Cedar Lane crossing","description":"The lamp has been out since Tuesday evening.","severity":"normal"}
```

`PATCH /reports/:id/status` example: `{"status":"assigned","assigned_to":"<staff profile uuid>"}`. Closing requires `{"status":"closed","repair_outcome":"Driver replaced and lamp tested."}`.

`POST /reports/:source/merge` example: `{"target_id":"<surviving report uuid>","note":"Same pole and outage confirmed by field review."}`.

Validation failures return 422; unauthenticated requests 401; permission/scope failures 403 or 404. Lists are paginated (default 25, maximum 100).
