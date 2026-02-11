# Arcade Room Management System - Technical Test

## Tech Stack

- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Frontend**: React + TypeScript (Vite) + Tailwind CSS
- **Database**: PostgreSQL (via Docker)

## Quick Start

### 1. Start the Database

```bash
docker-compose up -d
```

### 2. Setup Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Test Parts

### Part 1: Implement PATCH Endpoint (25-30 min)

**Task**: Implement `PATCH /api/sessions/:id/end` to end a game session.

**Requirements**:
1. Set `ended_at` to current timestamp
2. Update the machine status back to `'available'`
3. Check if player earned any achievements:
   - Count total sessions for this player on this game
   - Compare against `achievements.plays_required`
   - Insert into `player_achievements` if milestone reached (avoid duplicates)
4. Return: updated session + any newly earned achievements

**Frontend**: The "End Session" button in the Active Sessions list already calls the endpoint. When the user clicks it, disable the button until the request finishes.

### Part 2: Debug Database Constraint (15-20 min)

**The Bug**: Try to start a session on a machine that a player has used before. You'll get a constraint error.

**Steps to reproduce**:
1. End the active session (once you implement Part 1)
2. Try to start a new session with the same player on the same machine
3. Observe the error

**Your task**:
1. Reproduce the error
2. Read and understand the error message
3. Investigate the database schema (`backend/prisma/schema.prisma`)
4. Identify the problematic constraint
5. Explain why it's wrong and how to fix it

### Part 3: Refactor Discussion (10-15 min)

**The Code**: Look at `GET /api/players/:id/stats` in `backend/src/routes/players.ts`

**Discussion points**:
- What's wrong with this code?
- How would you restructure it?
- What patterns would you apply? (repository pattern, service layer, DTOs, etc.)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/games | List all games |
| GET | /api/machines | List all machines with status |
| GET | /api/players | List all players |
| GET | /api/players/:id/stats | Get player statistics (Part 3) |
| GET | /api/sessions | List active sessions |
| POST | /api/sessions | Start a new session (Part 2 bug) |
| PATCH | /api/sessions/:id/end | End a session (Part 1 - implement this) |

---

## Project Structure

```
/arcade-test
├── docker-compose.yml          # Postgres container
├── /backend
│   ├── package.json
│   ├── /prisma
│   │   ├── schema.prisma       # Database schema (includes the bug)
│   │   └── seed.ts             # Seed data
│   └── /src
│       ├── index.ts            # Express app setup
│       ├── prisma.ts           # Prisma client instance
│       ├── /routes
│       │   ├── sessions.ts     # Part 1 & 2
│       │   ├── players.ts      # Part 3
│       │   ├── games.ts
│       │   └── machines.ts
│       └── /services           # Empty - use if you want
├── /frontend
│   ├── package.json
│   ├── tailwind.config.js
│   └── /src
│       ├── App.tsx
│       ├── /components
│       │   ├── SessionsList.tsx
│       │   ├── StartSession.tsx
│       │   └── PlayerStats.tsx
│       └── /api
│           ├── sessions.ts
│           └── players.ts
└── README.md
```

---

## Seed Data

- **Games**: Pac-Man (2 tokens), Street Fighter (3 tokens), DDR (4 tokens)
- **Machines**: 4 machines (2 Pac-Man, 1 Street Fighter, 1 DDR)
- **Players**: John Doe (20 tokens), Jane Smith (15 tokens)
- **Achievements**: Pac-Man Rookie (3 plays), Pac-Man Pro (10 plays), Fighter (3 plays)
- **Active Session**: John Doe playing Street Fighter on Machine #3

---

## Evaluation Criteria

### Part 1
- Correct Prisma/SQL usage
- Handles the many-to-many relationship properly
- Uses transactions where appropriate
- Basic error handling

### Part 2
- Reads and understands error messages
- Knows how to inspect database constraints
- Can reason about why the constraint is incorrect
- Proposes correct solution

### Part 3
- Identifies lack of separation of concerns
- Understands layered architecture concepts
- Can articulate benefits of proper structure
