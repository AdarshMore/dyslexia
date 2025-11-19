import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivitySchema, insertBadgeSchema } from "@shared/schema";
import { generateEncouragingFeedback, generateLearningContent, generateProgressSummary } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get or create default learner
  app.get("/api/learner", async (req, res) => {
    try {
      const learner = await storage.getOrCreateDefaultLearner();
      res.json(learner);
    } catch (error) {
      res.status(500).json({ error: "Failed to get learner" });
    }
  });

  // Update learner settings
  app.put("/api/learner/:id/settings", async (req, res) => {
    try {
      const { id } = req.params;
      const settings = req.body;
      const updated = await storage.updateLearnerSettings(parseInt(id), settings);
      
      if (!updated) {
        return res.status(404).json({ error: "Learner not found" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Get progress stats
  app.get("/api/progress", async (req, res) => {
    try {
      const learner = await storage.getOrCreateDefaultLearner();
      const stats = await storage.getProgressStats(learner.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get progress" });
    }
  });

  // Get all activities
  app.get("/api/activities", async (req, res) => {
    try {
      const learner = await storage.getOrCreateDefaultLearner();
      const activities = await storage.getActivities(learner.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to get activities" });
    }
  });

  // Create activity
  app.post("/api/activities", async (req, res) => {
    try {
      const learner = await storage.getOrCreateDefaultLearner();
      const validated = insertActivitySchema.parse({
        ...req.body,
        learnerId: learner.id,
      });
      
      const activity = await storage.createActivity(validated);
      
      // Check for badge achievements
      if (activity.completed && activity.score !== null) {
        const activities = await storage.getActivities(learner.id);
        const completedActivities = activities.filter(a => a.completed);
        
        // First session badge
        if (completedActivities.length === 1) {
          await storage.createBadge({
            learnerId: learner.id,
            badgeType: "first-session",
          });
        }
        
        // Perfect score badge
        const totalQuestions = 5; // Assuming 5 questions per game
        if (activity.score === totalQuestions) {
          await storage.createBadge({
            learnerId: learner.id,
            badgeType: "perfect-score",
          });
        }
        
        // Streak badges
        const stats = await storage.getProgressStats(learner.id);
        if (stats.currentStreak === 3) {
          await storage.createBadge({
            learnerId: learner.id,
            badgeType: "streak-3",
          });
        }
      }
      
      res.json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid activity data" });
    }
  });

  // Get badges
  app.get("/api/badges", async (req, res) => {
    try {
      const learner = await storage.getOrCreateDefaultLearner();
      const badges = await storage.getBadges(learner.id);
      res.json(badges);
    } catch (error) {
      res.status(500).json({ error: "Failed to get badges" });
    }
  });

  // Generate AI feedback
  app.post("/api/ai/feedback", async (req, res) => {
    try {
      const { activityType, score, totalQuestions } = req.body;
      const feedback = await generateEncouragingFeedback(activityType, score, totalQuestions);
      res.json({ feedback });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate feedback" });
    }
  });

  // Generate AI learning content
  app.post("/api/ai/content", async (req, res) => {
    try {
      const { contentType, difficulty } = req.body;
      const content = await generateLearningContent(contentType, difficulty);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  // Generate progress summary
  app.post("/api/ai/summary", async (req, res) => {
    try {
      const { timeframe } = req.body;
      const learner = await storage.getOrCreateDefaultLearner();
      const activities = await storage.getRecentActivities(learner.id, 20);
      const summary = await generateProgressSummary(activities, timeframe);
      res.json({ summary });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
