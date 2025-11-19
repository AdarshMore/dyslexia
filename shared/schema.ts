import { pgTable, varchar, integer, boolean, timestamp, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const learners = pgTable("learners", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age"),
  learningNeeds: jsonb("learning_needs").$type<string[]>().notNull().default([]),
  settings: jsonb("settings").$type<{
    fontSize: "default" | "large" | "extraLarge";
    lineSpacing: "normal" | "relaxed" | "loose";
    highContrast: boolean;
    animationsEnabled: boolean;
    audioEnabled: boolean;
    hapticEnabled: boolean;
  }>().notNull().default({
    fontSize: "default",
    lineSpacing: "normal",
    highContrast: false,
    animationsEnabled: true,
    audioEnabled: true,
    hapticEnabled: true,
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  learnerId: integer("learner_id").notNull().references(() => learners.id),
  activityType: varchar("activity_type", { length: 50 }).notNull(),
  difficulty: integer("difficulty").notNull(),
  score: integer("score"),
  timeSpent: integer("time_spent"),
  completed: boolean("completed").notNull().default(false),
  data: jsonb("data").$type<Record<string, any>>().notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  learnerId: integer("learner_id").notNull().references(() => learners.id),
  badgeType: varchar("badge_type", { length: 100 }).notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

export const insertLearnerSchema = createInsertSchema(learners).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
  earnedAt: true,
});

export type Learner = typeof learners.$inferSelect;
export type InsertLearner = z.infer<typeof insertLearnerSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type LearnerSettings = {
  fontSize: "default" | "large" | "extraLarge";
  lineSpacing: "normal" | "relaxed" | "loose";
  highContrast: boolean;
  animationsEnabled: boolean;
  audioEnabled: boolean;
  hapticEnabled: boolean;
};

export type MathQuestion = {
  id: string;
  type: "number_recognition" | "addition" | "subtraction" | "counting" | "pattern_matching";
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: number;
  visualAid?: string;
};

export type ReadingContent = {
  id: string;
  title: string;
  text: string;
  difficulty: number;
  syllables: string[][];
};

export type ProgressStats = {
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number;
  accuracy: number;
  badgeCount: number;
  recentActivities: Activity[];
};
