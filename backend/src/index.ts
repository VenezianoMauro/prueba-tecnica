import express from 'express';
import cors from 'cors';
import gamesRouter from './routes/games';
import machinesRouter from './routes/machines';
import playersRouter from './routes/players';
import sessionsRouter from './routes/sessions';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/games', gamesRouter);
app.use('/api/machines', machinesRouter);
app.use('/api/players', playersRouter);
app.use('/api/sessions', sessionsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
