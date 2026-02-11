# Entity Relationship Diagram - Arcade Room Management

## Overview

This document describes the database schema for the Arcade Room Management system, which tracks players, games, machines, play sessions, and achievements.

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     Player      │       │      Game       │       │   Achievement   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id          PK  │       │ id          PK  │       │ id          PK  │
│ name            │       │ name            │       │ name            │
│ email       UK  │       │ tokensPerPlay   │       │ description     │
│ tokenBalance    │       │                 │       │ gameId      FK  │──┐
└────────┬────────┘       └────────┬────────┘       │ playsRequired   │  │
         │                         │                └────────┬────────┘  │
         │                         │                         │           │
         │ 1                       │ 1                       │           │
         │                         │                         │           │
         │ N                       │ N                       │ N         │ 1
         │                         │                         │           │
┌────────┴────────┐       ┌────────┴────────┐                │           │
│     Session     │       │     Machine     │                │           │
├─────────────────┤       ├─────────────────┤                │           │
│ id          PK  │       │ id          PK  │                │           │
│ playerId    FK  │──┐    │ gameId      FK  │────────────────┼───────────┘
│ machineId   FK  │──┼────│ status          │                │
│ startedAt       │  │    │                 │                │
│ endedAt         │  │    └─────────────────┘                │
│ tokensSpent     │  │                                       │
└─────────────────┘  │                                       │
                     │                                       │
                     │                                       │
                     │                                       │
                     │                                       │
                     │    ┌─────────────────┐                │
                     │    │PlayerAchievement│                │
                     │    ├─────────────────┤                │
                     └────│ playerId    PK,FK│               │
                          │ achievementId PK,FK│─────────────┘
                          │ earnedAt        │
                          └─────────────────┘
```

## Entities

### Player
Represents arcade players with their token balances.

| Column        | Type     | Constraints        | Description                    |
|---------------|----------|--------------------|---------------------------------|
| id            | Int      | PK, Auto-increment | Unique player identifier       |
| name          | String   | Required           | Player's display name          |
| email         | String   | Unique             | Player's email address         |
| tokenBalance  | Int      | Default: 0         | Current token balance          |

**Database Table:** `players`

---

### Game
Represents available arcade games.

| Column        | Type     | Constraints        | Description                    |
|---------------|----------|--------------------|---------------------------------|
| id            | Int      | PK, Auto-increment | Unique game identifier         |
| name          | String   | Required           | Game title                     |
| tokensPerPlay | Int      | Default: 1         | Tokens required per play       |

**Database Table:** `games`

---

### Machine
Represents physical arcade machines that run games.

| Column  | Type   | Constraints        | Description                           |
|---------|--------|--------------------|-----------------------------------------|
| id      | Int    | PK, Auto-increment | Unique machine identifier             |
| gameId  | Int    | FK → Game.id       | The game installed on this machine    |
| status  | String | Default: available | Machine status (available/in_use/maintenance) |

**Database Table:** `machines`

---

### Session
Represents a play session linking a player to a machine.

| Column      | Type      | Constraints           | Description                    |
|-------------|-----------|------------------------|---------------------------------|
| id          | Int       | PK, Auto-increment    | Unique session identifier      |
| playerId    | Int       | FK → Player.id        | Player who played              |
| machineId   | Int       | FK → Machine.id       | Machine that was used          |
| startedAt   | DateTime  | Default: now()        | Session start timestamp        |
| endedAt     | DateTime? | Nullable              | Session end timestamp          |
| tokensSpent | Int       | Required              | Tokens consumed in session     |

**Database Table:** `sessions`

---

### Achievement
Represents game-specific achievements that players can earn.

| Column        | Type    | Constraints        | Description                       |
|---------------|---------|--------------------|------------------------------------|
| id            | Int     | PK, Auto-increment | Unique achievement identifier     |
| name          | String  | Required           | Achievement title                 |
| description   | String? | Nullable           | Achievement description           |
| gameId        | Int     | FK → Game.id       | Game this achievement belongs to  |
| playsRequired | Int     | Required           | Number of plays needed to unlock  |

**Database Table:** `achievements`

---

### PlayerAchievement
Junction table representing earned achievements (many-to-many relationship).

| Column        | Type     | Constraints           | Description                    |
|---------------|----------|------------------------|---------------------------------|
| playerId      | Int      | PK, FK → Player.id    | Player who earned achievement  |
| achievementId | Int      | PK, FK → Achievement.id | Achievement that was earned   |
| earnedAt      | DateTime | Default: now()        | When the achievement was earned |

**Database Table:** `player_achievements`

**Primary Key:** Composite key on (playerId, achievementId)

---

## Relationships

| Relationship              | Type | Description                                          |
|---------------------------|------|------------------------------------------------------|
| Player → Session          | 1:N  | A player can have many play sessions                 |
| Machine → Session         | 1:N  | A machine can have many play sessions                |
| Game → Machine            | 1:N  | A game can be installed on many machines             |
| Game → Achievement        | 1:N  | A game can have many achievements                    |
| Player ↔ Achievement      | N:M  | Many-to-many via PlayerAchievement junction table    |

