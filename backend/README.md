# LocalHelp - Phase II Backend

Node.js + Express + MongoDB (Mongoose) + JWT authentication.

## Run
1. Install Node.js (v18+) and MongoDB Community Server (or use a free MongoDB Atlas URI).
2. `cd backend`
3. `npm install`
4. Check `.env` (copy of `.env.example`): set MONGO_URI and JWT_SECRET.
5. `npm run seed`   (demo providers + demo customer)
6. `npm start`
7. Open http://localhost:5000

## REST API
| Method | Endpoint | Who | Purpose |
|---|---|---|---|
| POST | /api/auth/register | public | Create account |
| POST | /api/auth/login | public | Login, returns JWT |
| GET | /api/auth/me | logged in | Current user |
| GET | /api/providers | public | List/search/filter providers |
| GET | /api/providers/:id | public | One provider |
| PUT | /api/providers/me/availability | provider | Available / Busy |
| POST | /api/requests | customer | Create service request |
| GET | /api/requests/my | customer | My requests |
| PUT | /api/requests/:id | customer | Edit pending request |
| DELETE | /api/requests/:id | customer | Cancel request |
| GET | /api/requests/provider | provider | Requests for me |
| PUT | /api/requests/:id/status | provider | Accepted / Rejected / Completed |

## Database collections
- users (customers + providers, `role` field)
- servicerequests (customer, provider, service, description, location, date, status)
