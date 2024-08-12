import {
  getRecallAverage,
  getWeeklyRecallAverage,
  getPracticeTotal,
  getAverageFragmentsReviewed,
  getStreak,
  calculateUserData,
} from './statistic-calculations';
import { subDays } from 'date-fns';
import { DailySession, Session } from "@/app/practice/components/dashboard/dashboard";

const today = new Date();
const yesterday = subDays(today, 1);
const twoDaysAgo = subDays(today, 2);

const dailySessions: DailySession[] = [
  {
    user_id: "user1",
    session_date: today.toISOString(),
    month_and_day: today.toISOString().slice(5, 10),
    session_count: 1,
    total_session_duration: 600000, // 10 minutes
    total_questions: 10,
    total_right_answers: 8
  },
  {
    user_id: "user1",
    session_date: yesterday.toISOString(),
    month_and_day: yesterday.toISOString().slice(5, 10),
    session_count: 1,
    total_session_duration: 720000, // 12 minutes
    total_questions: 10,
    total_right_answers: 7
  },
  {
    user_id: "user1",
    session_date: twoDaysAgo.toISOString(),
    month_and_day: twoDaysAgo.toISOString().slice(5, 10),
    session_count: 1,
    total_session_duration: 540000, // 9 minutes
    total_questions: 10,
    total_right_answers: 6
  }
];

const sessions: Session[] = [
  {
    session_duration: 600000, // 10 minutes
    created_at: today.toISOString(),
    total_questions: 10,
    right_answers: 8
  },
  {
    session_duration: 720000, // 12 minutes
    created_at: yesterday.toISOString(),
    total_questions: 10,
    right_answers: 7
  },
  {
    session_duration: 540000, // 9 minutes
    created_at: twoDaysAgo.toISOString(),
    total_questions: 10,
    right_answers: 6
  }
];

// Add this mock data for getStreak tests
const streakSessions = [
  { session_date: today.toISOString() },
  { session_date: yesterday.toISOString() },
  { session_date: twoDaysAgo.toISOString() }
];

describe('statistic-calculations', () => {
  describe('getRecallAverage', () => {
    it('should calculate the correct recall average', () => {
      expect(getRecallAverage(dailySessions)).toBe(70);
    });

    it('should return an empty string if there are no questions', () => {
      const noQuestionsSessions = [{ ...dailySessions[0], total_questions: 0, total_right_answers: 0 }];
      expect(getRecallAverage(noQuestionsSessions)).toBe('');
    });
  });

  describe('getWeeklyRecallAverage', () => {
    it('should calculate the correct weekly recall average', () => {
      expect(getWeeklyRecallAverage(dailySessions)).toBe(70);
    });

    it('should return 0 if there are no sessions this week', () => {
      const oldSessions = dailySessions.map(s => ({
        ...s,
        session_date: subDays(new Date(), 8).toISOString()
      }));
      expect(getWeeklyRecallAverage(oldSessions)).toBe(0);
    });
  });

  describe('getPracticeTotal', () => {
    it('should calculate the total practice time in minutes', () => {
      expect(getPracticeTotal(sessions)).toBe(31); // (10 + 12 + 9) minutes
    });
  });

  describe('getAverageFragmentsReviewed', () => {
    it('should calculate the average fragments reviewed', () => {
      expect(getAverageFragmentsReviewed(sessions)).toBe(10);
    });

    it('should return 0 if there are no fragments reviewed', () => {
      const noFragmentsSessions = [{ ...sessions[0], total_questions: 0 }];
      expect(getAverageFragmentsReviewed(noFragmentsSessions)).toBe(0);
    });
  });

  describe('getStreak', () => {
    it('should calculate the correct streak', () => {
      expect(getStreak(streakSessions)).toBe(3);
    });

    it('should return 0 if there are no sessions', () => {
      expect(getStreak([])).toBe(0);
    });

    it('should handle non-consecutive days', () => {
      const nonConsecutiveSessions = [
        { session_date: today.toISOString() },
        { session_date: subDays(today, 2).toISOString() }
      ];
      expect(getStreak(nonConsecutiveSessions)).toBe(1);
    });
  });

  describe('calculateUserData', () => {
    it('should calculate user data for the given timeframe', () => {
      const result = calculateUserData(dailySessions, 2);
      expect(result).toHaveLength(2);
      expect(result[0].recall).toBe(80);
      expect(result[1].recall).toBe(70);
    });
  });
});