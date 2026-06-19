import { boolean, integer, jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  spotifyId: varchar('spotify_id', { length: 64 }).notNull().unique(),
  displayName: text('display_name').notNull(),
  email: text('email'),
  refreshTokenEnc: text('refresh_token_enc').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tracks = pgTable('tracks', {
  id: varchar('id', { length: 36 }).primaryKey(),
  spotifyTrackId: varchar('spotify_track_id', { length: 64 }),
  spotifyUri: varchar('spotify_uri', { length: 128 }),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  genre: text('genre').notNull(),
  ring: integer('ring').notNull(),
  radius: integer('radius').notNull(),
  seed: integer('seed').notNull(),
  lengthMs: integer('length_ms').notNull(),
  freq: varchar('freq', { length: 16 }).notNull(),
  isNew: boolean('is_new').notNull().default(false),
});

export const tonightSetTracks = pgTable('tonight_set_tracks', {
  trackId: varchar('track_id', { length: 36 }).notNull(),
  position: integer('position').notNull(),
});

export const userState = pgTable('user_state', {
  userId: varchar('user_id', { length: 36 }).primaryKey(),
  radius: integer('radius').notNull().default(14),
  personaId: varchar('persona_id', { length: 16 }).notNull().default('mira'),
  sleep: boolean('sleep').notNull().default(false),
  autoAdvance: boolean('auto_advance').notNull().default(true),
  presets: jsonb('presets').notNull().default(['t1', 't4', 't7']),
  saved: jsonb('saved').notNull().default([]),
  courageMaxRingSession: integer('courage_max_ring_session').notNull().default(0),
  courageStreakDays: integer('courage_streak_days').notNull().default(0),
  onboarded: boolean('onboarded').notNull().default(false),
  onboardingPicks: jsonb('onboarding_picks').notNull().default([]),
  currentTrackId: varchar('current_track_id', { length: 36 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chatMessages = pgTable('chat_messages', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  who: varchar('who', { length: 8 }).notNull(), // 'me' | 'dj'
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
