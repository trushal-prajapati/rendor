# RenderSkin Clinic — Spring Boot API

Monolithic Spring Boot backend with JWT role-based authentication.

## Roles
- **PATIENT** — register, book appointments, upload skin photos
- **DOCTOR** — view assigned patients, clinical profiles, uploaded JPG scans
- **RECEPTIONIST** — view/manage all appointments

## Run
```bash
cd backend
mvn spring-boot:run
```
API runs at `http://localhost:8080`

## Demo accounts (password: `password123`)
| Role | Email |
|------|-------|
| Patient | patient@demo.com |
| Doctor | sarah.jenkins@renderskin.com |
| Receptionist | reception@renderskin.com |

## Key endpoints
- `POST /api/auth/login` — JWT login
- `POST /api/auth/register` — patient registration
- `GET /api/receptionist/appointments` — receptionist dashboard
- `GET /api/doctor/patients` — doctor patient list
- `GET /api/doctor/patients/{id}` — patient detail + files
- `POST /api/patient/files` — upload JPG (multipart)
- `GET /api/files/{id}` — view/download file (authenticated)
