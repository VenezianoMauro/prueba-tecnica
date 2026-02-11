import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.playerAchievement.deleteMany();
  await prisma.session.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.machine.deleteMany();
  await prisma.game.deleteMany();
  await prisma.player.deleteMany();

  // Games
  await prisma.game.createMany({
    data: [
      { id: 1, name: 'Pac-Man', tokensPerPlay: 2 },
      { id: 2, name: 'Street Fighter', tokensPerPlay: 3 },
      { id: 3, name: 'Dance Dance Revolution', tokensPerPlay: 4 },
    ]
  });

  // Machines
  await prisma.machine.createMany({
    data: [
      { id: 1, gameId: 1, status: 'available' },
      { id: 2, gameId: 1, status: 'available' },
      { id: 3, gameId: 2, status: 'in_use' },
      { id: 4, gameId: 3, status: 'available' },
    ]
  });

  // Players
  await prisma.player.createMany({
    data: [
      { id: 1, name: 'John Doe', email: 'john@test.com', tokenBalance: 20 },
      { id: 2, name: 'Jane Smith', email: 'jane@test.com', tokenBalance: 15 },
    ]
  });

  // Achievements
  await prisma.achievement.createMany({
    data: [
      { id: 1, name: 'Pac-Man Rookie', description: 'Play Pac-Man 3 times', gameId: 1, playsRequired: 3 },
      { id: 2, name: 'Pac-Man Pro', description: 'Play Pac-Man 10 times', gameId: 1, playsRequired: 10 },
      { id: 3, name: 'Fighter', description: 'Play Street Fighter 3 times', gameId: 2, playsRequired: 3 },
    ]
  });

  // Active session (for testing Part 1)
  await prisma.session.create({
    data: { playerId: 1, machineId: 3, tokensSpent: 3 }
  });

  // Note: We can NOT seed historical sessions on the SAME machine
  // because of the intentional bug (unique constraint on playerId + machineId)

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
