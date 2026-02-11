import { useState } from 'react';
import SessionsList from './components/SessionsList';
import StartSession from './components/StartSession';
import PlayerStats from './components/PlayerStats';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSessionStarted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-arcade-dark p-8 scanlines">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="title-arcade text-4xl glow-green cursor-blink">
            Arcade Room
          </h1>
          <p className="text-arcade-hot-pink font-mono text-sm mt-4 uppercase tracking-widest">
            Management System
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <SessionsList key={refreshKey} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <StartSession onSessionStarted={handleSessionStarted} />
            <PlayerStats />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-xs uppercase tracking-wider">
          <p>Technical Test - Arcade Room Management</p>
          <p className="mt-2 text-arcade-purple">
            Part 1: Implement PATCH /api/sessions/:id/end
          </p>
          <p className="text-arcade-hot-pink">
            Part 2: Debug the error when replaying a machine
          </p>
          <p className="text-arcade-electric-blue">
            Part 3: Discuss refactoring GET /api/players/:id/stats
          </p>
        </footer>
      </div>
    </div>
  );
}
