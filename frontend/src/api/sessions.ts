const API_BASE = '/api';

export interface Player {
  id: number;
  name: string;
  email: string;
  tokenBalance: number;
}

export interface Game {
  id: number;
  name: string;
  tokensPerPlay: number;
}

export interface Machine {
  id: number;
  gameId: number;
  game: Game;
  status: 'available' | 'in_use' | 'maintenance';
}

export interface Session {
  id: number;
  playerId: number;
  player: Player;
  machineId: number;
  machine: Machine;
  startedAt: string;
  endedAt: string | null;
  tokensSpent: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string | null;
  gameId: number;
  playsRequired: number;
}

export interface EndSessionResponse {
  session: Session;
  newAchievements: Achievement[];
}

// Get all active sessions
export async function getActiveSessions(): Promise<Session[]> {
  const response = await fetch(`${API_BASE}/sessions`);
  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }
  return response.json();
}

// Get a single session
export async function getSession(id: number): Promise<Session> {
  const response = await fetch(`${API_BASE}/sessions/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch session');
  }
  return response.json();
}

// Start a new session
export async function startSession(playerId: number, machineId: number): Promise<Session> {
  const response = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playerId, machineId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to start session');
  }

  return response.json();
}

// End a session
export async function endSession(id: number): Promise<EndSessionResponse> {
  // TODO: implement
}
