import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';
import { stationsRouter } from './routes/stations.routes.js';
import { stateRouter } from './routes/state.routes.js';
import { djRouter } from './routes/dj.routes.js';
import { meRouter } from './routes/me.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/stations', stationsRouter);
app.use('/api/state', stateRouter);
app.use('/api/dj', djRouter);
app.use('/api/me', meRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`orbit backend listening on :${env.PORT}`);
});
