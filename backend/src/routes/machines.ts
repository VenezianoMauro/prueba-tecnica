import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /api/machines - list machines with status
router.get('/', async (req, res) => {
  try {
    const machines = await prisma.machine.findMany({
      include: {
        game: true,
      },
    });
    res.json(machines);
  } catch (error) {
    console.error('Error fetching machines:', error);
    res.status(500).json({ error: 'Failed to fetch machines' });
  }
});

// GET /api/machines/:id
router.get('/:id', async (req, res) => {
  try {
    const machine = await prisma.machine.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        game: true,
        sessions: {
          where: { endedAt: null },
          include: { player: true },
        },
      },
    });
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }
    res.json(machine);
  } catch (error) {
    console.error('Error fetching machine:', error);
    res.status(500).json({ error: 'Failed to fetch machine' });
  }
});

export default router;
