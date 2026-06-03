# OPD Mini Module

Small demo-ready OPD project based on the technical task PDF. It covers:

- Patient Registration: add, list, and search by name/phone.
- Appointment Booking: book appointment with date/time and doctor.
- Consultation Summary: enter 2 vitals, notes, mark complete, and view patient history.

## Tech Stack

- Backend: Java 17, Spring Boot, Spring Web, Spring Data JPA, Bean Validation
- Database: MySQL 8.4
- Frontend: Angular standalone components
- Local DB helper: Docker Compose

## Project Structure

```text
.
├── backend/                 Spring Boot REST API
├── frontend/                Angular UI
├── docker-compose.yml       MySQL container
├── README.md                Setup and API guide
└── EXPLANATION_HINGLISH.md  Review explanation in Hinglish
```

## Run Locally

### 1. Start MySQL

```bash
docker compose up -d
```

Default DB config:

- Database: `opd_db`
- Username: `root`
- Password: `root`
- Port: `3306`

You can override from environment variables:

```bash
DB_URL=jdbc:mysql://localhost:3306/opd_db
DB_USERNAME=root
DB_PASSWORD=root
```

### 2. Start Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm start
```

Angular runs on:

```text
http://localhost:4200
```

The Angular proxy forwards `/api` calls to `http://localhost:8080`.

## REST APIs

### Patients

```http
POST /api/patients
GET  /api/patients
GET  /api/patients?search=ravi
GET  /api/patients/{patientId}
```

Sample create patient:

```json
{
  "name": "Ravi Kumar",
  "gender": "MALE",
  "age": 34,
  "phoneNumber": "9876543210"
}
```

### Appointments

```http
POST /api/appointments
GET  /api/appointments/today
GET  /api/appointments/patient/{patientId}
```

Sample book appointment:

```json
{
  "patientId": 1,
  "appointmentAt": "2026-05-09T15:30:00",
  "doctorName": "Dr. Mehta"
}
```

### Consultations

```http
POST /api/consultations/appointment/{appointmentId}/complete
GET  /api/consultations/patient/{patientId}
```

Sample complete consultation:

```json
{
  "bloodPressure": "120/80",
  "temperatureC": 37.1,
  "notes": "Mild fever. Advised rest and fluids."
}
```

## Demo Flow

1. Go to `Patients`, create a patient, then search by name or phone.
2. Go to `Appointments`, select that patient, add date/time and doctor, then book.
3. Go to `Consultations`, pick the booked appointment, enter BP, temperature, notes, and mark complete.
4. Select the patient in consultation history to view completed consultations.

## Review Notes

Detailed Hinglish explanation is in `EXPLANATION_HINGLISH.md`.

