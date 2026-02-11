import { useState, useEffect } from 'react';
import { startSession } from '../api/sessions';
import { getPlayers, Player } from '../api/players';
import { getMachines, Machine } from '../api/machines';

interface StartSessionProps {
  onSessionStarted?: () => void;
}

export default function StartSession({ onSessionStarted }: StartSessionProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | ''>('');
  const [selectedMachine, setSelectedMachine] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersData, machinesData] = await Promise.all([
          getPlayers(),
          getMachines(),
        ]);
        setPlayers(playersData);
        setMachines(machinesData);
      } catch (err) {
        setError('Failed to load data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPlayer === '' || selectedMachine === '') {
      setError('Please select a player and machine');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const session = await startSession(selectedPlayer, selectedMachine);
      setSuccess(`Session started! ${session.player.name} is now playing ${session.machine.game.name}`);
      setSelectedPlayer('');
      setSelectedMachine('');
      onSessionStarted?.();
    } catch (err) {
      // This is where the Part 2 bug will manifest!
      // The unique constraint error will appear here
      setError(err instanceof Error ? err.message : 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const availableMachines = machines.filter(m => m.status === 'available');

  return (
    <div className="card-pink">
      <h2 className="subtitle-arcade glow-pink">Start New Session</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-arcade-electric-blue mb-2 text-sm uppercase tracking-wider">
            Select Player
          </label>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value ? parseInt(e.target.value) : '')}
            className="select-brutal"
          >
            <option value="">-- Choose Player --</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.tokenBalance} tokens)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-arcade-electric-blue mb-2 text-sm uppercase tracking-wider">
            Select Machine
          </label>
          <select
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value ? parseInt(e.target.value) : '')}
            className="select-brutal"
          >
            <option value="">-- Choose Machine --</option>
            {availableMachines.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machine.game.name} - Machine #{machine.id} ({machine.game.tokensPerPlay} tokens)
              </option>
            ))}
          </select>
          {availableMachines.length === 0 && (
            <p className="text-arcade-orange text-sm mt-2">No machines available</p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-900 border-4 border-red-500 text-red-200 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-900 border-4 border-arcade-neon-green text-arcade-neon-green text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || selectedPlayer === '' || selectedMachine === ''}
          className="w-full btn-neon-green disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Starting...' : 'Start Session'}
        </button>
      </form>
    </div>
  );
}
