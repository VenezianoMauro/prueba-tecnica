import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /api/players - list players
router.get('/', async (req, res) => {
  try {
    const players = await prisma.player.findMany();
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// GET /api/players/:id
router.get('/:id', async (req, res) => {
  try {
    const player = await prisma.player.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        achievements: {
          include: { achievement: true },
        },
      },
    });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

// GET /api/players/:id/stats - **BAD CODE STRUCTURE** (Part 3)
// NO ALLOWED TO USE AI FOR THEORETICAL PART OF THE EVALUATION
router.get('/:id/stats', async (req, res) => {
  const playerId = parseInt(req.params.id);

  const player = await prisma.player.findUnique({
    where: { id: playerId }
  });

  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }

  const sessions = await prisma.session.findMany({
    where: { playerId }
  });

  // Business logic
  let totalTokensSpent = 0;
  let totalPlayTime = 0;
  for (const session of sessions) {
    totalTokensSpent += session.tokensSpent;
    if (session.endedAt) {
      totalPlayTime += new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime();
    }
  }

  const achievements = await prisma.playerAchievement.findMany({
    where: { playerId },
    include: { achievement: true }
  });

  res.json({
    player,
    totalTokensSpent,
    totalPlayTime,
    totalSessions: sessions.length,
    achievements: achievements.map(pa => pa.achievement)
  });
});

export default router;
