import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /api/games - list all games
router.get('/', async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      include: {
        machines: true,
        achievements: true,
      },
    });
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// GET /api/games/:id
router.get('/:id', async (req, res) => {
  try {
    const game = await prisma.game.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        machines: true,
        achievements: true,
      },
    });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

export default router;
