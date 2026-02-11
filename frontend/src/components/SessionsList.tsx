import { useState, useEffect } from 'react';
import { getActiveSessions, endSession, Session } from '../api/sessions';

export default function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [endingSession, setEndingSession] = useState<number | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getActiveSessions();
      setSessions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleEndSession = async (sessionId: number) => {
    try {
    
      const result = await endSession(sessionId);

      // Show achievements if any were earned
      if (result.newAchievements && result.newAchievements.length > 0) {
        alert(`Achievements earned: ${result.newAchievements.map(a => a.name).join(', ')}`);
      }

      // Refresh the sessions list
      await fetchSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end session');
    } 
  };

  const formatDuration = (startedAt: string) => {
    const start = new Date(startedAt);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="card-neon">
        <h2 className="subtitle-arcade">Active Sessions</h2>
        <p className="text-arcade-neon-green animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="card-neon">
      <h2 className="subtitle-arcade glow-green">Active Sessions</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-900 border-4 border-red-500 text-red-200">
          {error}
        </div>
      )}

      {sessions.length === 0 ? (
        <p className="text-gray-400">No active sessions</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-arcade-dark border-4 border-arcade-electric-blue p-4 flex justify-between items-center"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-arcade-yellow font-bold">
                    {session.player.name}
                  </span>
                  <span className="text-arcade-hot-pink">→</span>
                  <span className="text-arcade-electric-blue font-bold">
                    {session.machine.game.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    (Machine #{session.machineId})
                  </span>
                </div>
                <div className="text-sm text-gray-400 flex gap-4">
                  <span>
                    Tokens: <span className="text-arcade-neon-green">{session.tokensSpent}</span>
                  </span>
                  <span>
                    Duration: <span className="text-arcade-purple">{formatDuration(session.startedAt)}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleEndSession(session.id)}
                className="btn-hot-pink text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {endingSession === session.id ? 'Ending...' : 'End Session'}
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchSessions}
        className="mt-4 btn-electric-blue text-sm"
      >
        Refresh
      </button>
    </div>
  );
}
