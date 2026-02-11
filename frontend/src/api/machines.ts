const API_BASE = '/api';

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

// Get all machines
export async function getMachines(): Promise<Machine[]> {
  const response = await fetch(`${API_BASE}/machines`);
  if (!response.ok) {
    throw new Error('Failed to fetch machines');
  }
  return response.json();
}
