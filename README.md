## Medication Email Reminder System

Simple demo project: Node.js + Express backend that schedules email reminders (using nodemailer + node-cron)
and a minimal frontend to create reminders.

## Features
- REST API to create/li#st/delete reminders
- Scheduler (node-cron) that checks reminders and sends emails
- Simple frontend (HTML + JS) to schedule reminders
- Data persisted to a simple JSON file (`data/reminders.json`) for demo purposes

## Requirements
- Node.js v18+ recommended
- An SMTP account (Gmail SMTP, SendGrid, Mailgun, or any SMTP server)

## Setup (local)
1. Clone or unzip the project.
2. `cd backend`
3. Copy `.env.example` to `.env` and fill in your SMTP credentials and `FROM_EMAIL`.
4. `npm install`
5. `node index.js`
6. Open `frontend/index.html` in your browser (or use the minimal frontend server).

## API
- `POST /api/reminders` — create reminder
  JSON body example:
  ```
  {
    "name": "Take insulin",
    "email": "user@example.com",
    "medication": "Insulin 10 units",
    "datetime": "2025-10-20T09:00:00"
  }
  ```
- `GET /api/reminders` — list reminders
- `DELETE /api/reminders/:id` — delete reminder

## Note
This project uses a JSON file for persistence (demo only). For production, use a real database (MongoDB, PostgreSQL, etc.)
