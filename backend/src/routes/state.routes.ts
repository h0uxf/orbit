import { Router } from 'express';
import { eq } from 'drizzle-orm';
import type { UserState } from '@orbit/shared';
import { db } from '../db/client.js';
import { userState } from '../db/schema.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const stateRouter = Router();
stateRouter.use(requireAuth);

function toApi(row: typeof userState.$inferSelect): UserState {
  return {
    radius: row.radius,
    personaId: row.personaId as UserState['personaId'],
    sleep: row.sleep,
    autoAdvance: row.autoAdvance,
    presets: row.presets as string[],
    saved: row.saved as string[],
    courage: { maxRingSession: row.courageMaxRingSession, streakDays: row.courageStreakDays },
    onboarded: row.onboarded,
    onboardingPicks: row.onboardingPicks as string[],
    currentTrackId: row.currentTrackId,
  };
}

async function getOrCreate(userId: string) {
  const existing = await db.query.userState.findFirst({ where: eq(userState.userId, userId) });
  if (existing) return existing;
  const [created] = await db.insert(userState).values({ userId }).returning();
  return created;
}

stateRouter.get('/', async (req, res) => {
  const row = await getOrCreate(req.userId!);
  res.json(toApi(row));
});

interface StatePatchBody {
  radius?: number;
  personaId?: UserState['personaId'];
  sleep?: boolean;
  autoAdvance?: boolean;
  presets?: string[];
  saved?: string[];
  courage?: { maxRingSession?: number; streakDays?: number };
  onboarded?: boolean;
  onboardingPicks?: string[];
  currentTrackId?: string | null;
}

stateRouter.patch('/', async (req, res) => {
  await getOrCreate(req.userId!);
  const body = req.body as StatePatchBody;

  const update: Partial<typeof userState.$inferInsert> = { updatedAt: new Date() };
  if (body.radius !== undefined) update.radius = Math.max(0, Math.min(100, Math.round(body.radius)));
  if (body.personaId !== undefined) update.personaId = body.personaId;
  if (body.sleep !== undefined) update.sleep = body.sleep;
  if (body.autoAdvance !== undefined) update.autoAdvance = body.autoAdvance;
  if (body.presets !== undefined) update.presets = body.presets;
  if (body.saved !== undefined) update.saved = body.saved;
  if (body.onboarded !== undefined) update.onboarded = body.onboarded;
  if (body.onboardingPicks !== undefined) update.onboardingPicks = body.onboardingPicks;
  if (body.currentTrackId !== undefined) update.currentTrackId = body.currentTrackId;
  if (body.courage?.maxRingSession !== undefined) update.courageMaxRingSession = body.courage.maxRingSession;
  if (body.courage?.streakDays !== undefined) update.courageStreakDays = body.courage.streakDays;

  const [row] = await db.update(userState).set(update).where(eq(userState.userId, req.userId!)).returning();
  res.json(toApi(row));
});
