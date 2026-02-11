import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /api/sessions - list active sessions (ended_at IS NULL)
router.get('/', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { endedAt: null },
      include: {
        player: true,
        machine: {
          include: { game: true },
        },
      },
    });
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET /api/sessions/:id
router.get('/:id', async (req, res) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        player: true,
        machine: {
          include: { game: true },
        },
      },
    });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// POST /api/sessions 
router.post('/', async (req, res) => {
  try {
    const { playerId, machineId } = req.body;

    // Validate input
    if (!playerId || !machineId) {
      return res.status(400).json({ error: 'playerId and machineId are required' });
    }

    // Check if machine exists and is available
    const machine = await prisma.machine.findUnique({
      where: { id: machineId },
      include: { game: true },
    });

    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    if (machine.status !== 'available') {
      return res.status(400).json({ error: 'Machine is not available' });
    }

    // Check if player exists and has enough tokens
    const player = await prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    if (player.tokenBalance < machine.game.tokensPerPlay) {
      return res.status(400).json({ error: 'Insufficient tokens' });
    }

    // Create session and update machine status in a transaction
    const session = await prisma.$transaction(async (tx) => {
      // Deduct tokens from player
      await tx.player.update({
        where: { id: playerId },
        data: { tokenBalance: { decrement: machine.game.tokensPerPlay } },
      });

      // Update machine status
      await tx.machine.update({
        where: { id: machineId },
        data: { status: 'in_use' },
      });

      // Create session
      return tx.session.create({
        data: {
          playerId,
          machineId,
          tokensSpent: machine.game.tokensPerPlay,
        },
        include: {
          player: true,
          machine: {
            include: { game: true },
          },
        },
      });
    });

    res.status(201).json(session);
  } catch (error: any) {
    console.error('Error creating session:', error);


    res.status(500).json({ error: 'Failed to create session' });
  }
});

// PATCH /api/sessions/:id/end - **STUB ONLY** (candidate implements in Part 1)
// TODO: Implement this endpoint
// Requirements:
// 1. Set `ended_at` to current timestamp
// 2. Update the machine status back to 'available'
// 3. Check if player earned any achievements:
//    - Count total sessions for this player on this game
//    - Compare against `achievements.plays_required`
//    - Insert into `player_achievements` if milestone reached (avoid duplicates)
// 4. Return: updated session + any newly earned achievements
router.patch('/:id/end', async (req, res) => {
  // TODO: Candidate should implement this endpoint

});

export default router;
