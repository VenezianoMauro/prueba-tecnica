const API_BASE = '/api';

export interface Player {
  id: number;
  name: string;
  email: string;
  tokenBalance: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string | null;
  gameId: number;
  playsRequired: number;
}

export interface PlayerStats {
  player: Player;
  totalTokensSpent: number;
  totalPlayTime: number;
  totalSessions: number;
  achievements: Achievement[];
}

// Get all players
export async function getPlayers(): Promise<Player[]> {
  const response = await fetch(`${API_BASE}/players`);
  if (!response.ok) {
    throw new Error('Failed to fetch players');
  }
  return response.json();
}

// Get player stats (Part 3 - bad code structure example)
export async function getPlayerStats(id: number): Promise<PlayerStats> {
  const response = await fetch(`${API_BASE}/players/${id}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch player stats');
  }
  return response.json();
}
