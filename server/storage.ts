import { 
  type Learner, 
  type InsertLearner,
  type Activity,
  type InsertActivity,
  type Badge,
  type InsertBadge,
  type ProgressStats,
  type LearnerSettings,
  learners,
  activities,
  badges
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { eq, desc, and } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  getLearner(id: number): Promise<Learner | undefined>;
  getOrCreateDefaultLearner(): Promise<Learner>;
  updateLearnerSettings(id: number, settings: LearnerSettings): Promise<Learner | undefined>;
  
  getActivities(learnerId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(learnerId: number, limit: number): Promise<Activity[]>;
  
  getBadges(learnerId: number): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  getProgressStats(learnerId: number): Promise<ProgressStats>;
}

export class DatabaseStorage implements IStorage {
  async getLearner(id: number): Promise<Learner | undefined> {
    const result = await db.select().from(learners).where(eq(learners.id, id));
    return result[0];
  }

  async getOrCreateDefaultLearner(): Promise<Learner> {
    const existing = await db.select().from(learners).limit(1);
    if (existing.length > 0) {
      return existing[0];
    }

    const newLearner: InsertLearner = {
      name: "Learner",
      age: null,
      learningNeeds: ["dyslexia", "dyscalculia"],
      settings: {
        fontSize: "default",
        lineSpacing: "normal",
        highContrast: false,
        animationsEnabled: true,
        audioEnabled: true,
        hapticEnabled: true,
      },
    };
    
    const result = await db.insert(learners).values(newLearner).returning();
    return result[0];
  }

  async updateLearnerSettings(id: number, settings: LearnerSettings): Promise<Learner | undefined> {
    const result = await db
      .update(learners)
      .set({ settings })
      .where(eq(learners.id, id))
      .returning();
    
    return result[0];
  }

  async getActivities(learnerId: number): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.learnerId, learnerId))
      .orderBy(desc(activities.createdAt));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(insertActivity).returning();
    return result[0];
  }

  async getRecentActivities(learnerId: number, limit: number): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.learnerId, learnerId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async getBadges(learnerId: number): Promise<Badge[]> {
    return await db
      .select()
      .from(badges)
      .where(eq(badges.learnerId, learnerId))
      .orderBy(desc(badges.earnedAt));
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const result = await db.insert(badges).values(insertBadge).returning();
    return result[0];
  }

  async getProgressStats(learnerId: number): Promise<ProgressStats> {
    const allActivities = await this.getActivities(learnerId);
    const allBadges = await this.getBadges(learnerId);
    
    const completedActivities = allActivities.filter(a => a.completed);
    const totalTimeSpent = allActivities.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
    
    const correctAnswers = allActivities.filter(a => a.score !== null && a.score > 0).length;
    const totalAnswered = allActivities.filter(a => a.score !== null).length;
    const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
    
    const currentStreak = this.calculateCurrentStreak(allActivities);
    const longestStreak = this.calculateLongestStreak(allActivities);
    
    return {
      totalSessions: completedActivities.length,
      currentStreak,
      longestStreak,
      totalTimeSpent: Math.round(totalTimeSpent / 60),
      accuracy,
      badgeCount: allBadges.length,
      recentActivities: allActivities.slice(0, 5),
    };
  }

  private calculateCurrentStreak(activities: Activity[]): number {
    if (activities.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedActivities = activities
      .filter(a => a.completed)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    if (sortedActivities.length === 0) return 0;
    
    const latestActivity = sortedActivities[0];
    const latestDate = new Date(latestActivity.createdAt);
    latestDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 1) return 0;
    
    let streak = 1;
    let currentDate = new Date(latestDate);
    
    for (let i = 1; i < sortedActivities.length; i++) {
      const activityDate = new Date(sortedActivities[i].createdAt);
      activityDate.setHours(0, 0, 0, 0);
      
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      if (activityDate.getTime() === prevDate.getTime()) {
        streak++;
        currentDate = activityDate;
      } else if (activityDate.getTime() < prevDate.getTime()) {
        break;
      }
    }
    
    return streak;
  }

  private calculateLongestStreak(activities: Activity[]): number {
    if (activities.length === 0) return 0;
    
    const sortedActivities = activities
      .filter(a => a.completed)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    if (sortedActivities.length === 0) return 0;
    
    let maxStreak = 1;
    let currentStreak = 1;
    let currentDate = new Date(sortedActivities[0].createdAt);
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < sortedActivities.length; i++) {
      const activityDate = new Date(sortedActivities[i].createdAt);
      activityDate.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      if (activityDate.getTime() === nextDate.getTime()) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (activityDate.getTime() > nextDate.getTime()) {
        currentStreak = 1;
      }
      
      currentDate = activityDate;
    }
    
    return maxStreak;
  }
}

export const storage = new DatabaseStorage();
