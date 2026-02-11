import { useState, useEffect } from 'react';
import { getPlayers, getPlayerStats, Player, PlayerStats as Stats } from '../api/players';

export default function PlayerStats() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | ''>('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers();
        setPlayers(data);
      } catch (err) {
        setError('Failed to load players');
      }
    };
    fetchPlayers();
  }, []);

  const handleViewStats = async () => {
    if (selectedPlayer === '') return;

    setLoading(true);
    setError(null);
    setStats(null);

    try {
      const data = await getPlayerStats(selectedPlayer);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const formatPlayTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="card-brutal border-arcade-yellow">
      <h2 className="subtitle-arcade glow-yellow">Player Stats</h2>

      <div className="flex gap-4 mb-4">
        <select
          value={selectedPlayer}
          onChange={(e) => {
            setSelectedPlayer(e.target.value ? parseInt(e.target.value) : '');
            setStats(null);
          }}
          className="select-brutal flex-1"
        >
          <option value="">-- Select Player --</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleViewStats}
          disabled={loading || selectedPlayer === ''}
          className="btn-orange disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'View Stats'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900 border-4 border-red-500 text-red-200 text-sm">
          {error}
        </div>
      )}

      {stats && (
        <div className="space-y-4 mt-4">
          <div className="bg-arcade-dark border-4 border-arcade-purple p-4">
            <h3 className="text-arcade-purple font-bold mb-3 uppercase">
              {stats.player.name}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Email:</span>
                <span className="ml-2 text-white">{stats.player.email}</span>
              </div>
              <div>
                <span className="text-gray-400">Token Balance:</span>
                <span className="ml-2 text-arcade-neon-green font-bold">
                  {stats.player.tokenBalance}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Total Sessions:</span>
                <span className="ml-2 text-arcade-electric-blue font-bold">
                  {stats.totalSessions}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Tokens Spent:</span>
                <span className="ml-2 text-arcade-hot-pink font-bold">
                  {stats.totalTokensSpent}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Total Play Time:</span>
                <span className="ml-2 text-arcade-yellow font-bold">
                  {formatPlayTime(stats.totalPlayTime)}
                </span>
              </div>
            </div>
          </div>

          {stats.achievements.length > 0 && (
            <div className="bg-arcade-dark border-4 border-arcade-neon-green p-4">
              <h4 className="text-arcade-neon-green font-bold mb-3 uppercase">
                Achievements
              </h4>
              <div className="space-y-2">
                {stats.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-arcade-yellow">★</span>
                    <span className="text-white font-bold">{achievement.name}</span>
                    {achievement.description && (
                      <span className="text-gray-400">- {achievement.description}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.achievements.length === 0 && (
            <p className="text-gray-400 text-sm">No achievements yet. Keep playing!</p>
          )}
        </div>
      )}
    </div>
  );
}
